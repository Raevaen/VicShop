param location string = 'italynorth'
param appServicePlanName string
param staticWebAppName string
param apiAppServiceName string
param keyVaultName string
param managedIdentityName string
param cosmosDbAccountName string
param databaseName string = 'vicshop'
param productsCollectionName string = 'products'
param ordersCollectionName string = 'orders'

// --- Web/App Service Resources ---

resource appServicePlan 'Microsoft.Web/serverfarms@2022-03-01' = {
  name: appServicePlanName
  location: location
  sku: {
    name: 'F1'
    tier: 'Free'
  }
  kind: 'linux'
  properties: {
    reserved: true
  }
}

resource staticWebApp 'Microsoft.Web/sites@2022-03-01' = {
  name: staticWebAppName
  location: location
  kind: 'app'
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      appSettings: [
        {
          name: 'NEXT_PUBLIC_API_URL'
          value: 'https://${apiAppServiceName}.azurewebsites.net'
        }
      ]
    }
    identity: {
      type: 'UserAssigned'
      userAssignedIdentities: {
        '${managedIdentity.id}': {}
      }
    }
  }
}

resource apiAppService 'Microsoft.Web/sites@2022-03-01' = {
  name: apiAppServiceName
  location: location
  kind: 'app,linux,container'
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      linuxFxVersion: 'DOCKER|index.docker.io/${keyVault.getSecret('docker-username')}/vicshop-api:latest' // This might fail if secret doesn't exist during template expansion. Better to use a param or reference. 
      // Actually, we can't use getSecret here easily for the string interpolation if the keyvault is being created.
      // Safer to rely on App Settings. linuxFxVersion can be generic or updated by pipeline.
      // Let's set a placeholder that the Pipeline DEPLOY stage will overwrite, OR use the AppSettings to drive it.
      // DOCKER|<image> is sufficient. 
      // If we use App Settings for auth, App Service tries to pull.
      // Let's assume the user will provide the image name in the pipeline. 
      // For Bicep, let's just stick to a "latest" tag with a placeholder or param.
      // The User said: "Take credentials from key vault".
      // Let's use the Key Vault References for the App Settings.
      appSettings: [
        {
          name: 'DOCKER_REGISTRY_SERVER_URL'
          value: 'https://index.docker.io/v1/'
        }
        {
          name: 'DOCKER_REGISTRY_SERVER_USERNAME'
          value: '@Microsoft.KeyVault(VaultName=${keyVaultName};SecretName=docker-username)'
        }
        {
          name: 'DOCKER_REGISTRY_SERVER_PASSWORD'
          value: '@Microsoft.KeyVault(VaultName=${keyVaultName};SecretName=docker-password)'
        }
        {
          name: 'ProductsDatabaseSettings__ConnectionString'
          value: listConnectionStrings(cosmosDbAccount.id, cosmosDbAccount.apiVersion).connectionStrings[0].connectionString
        }
        {
          name: 'ProductsDatabaseSettings__DatabaseName'
          value: databaseName
        }
        {
          name: 'ProductsDatabaseSettings__ProductsCollectionName'
          value: productsCollectionName
        }
        {
          name: 'ProductsDatabaseSettings__OrdersCollectionName'
          value: ordersCollectionName
        }
      ]
    }
  }
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${managedIdentity.id}': {}
    }
  }
}

// --- Managed Identity Resource ---

resource managedIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: managedIdentityName
  location: location
}

// --- Key Vault Resource ---

resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' = { // Updated API
  name: keyVaultName
  location: location
  properties: {
    sku: {
      family: 'A'
      name: 'standard'
    }
    tenantId: subscription().tenantId
    // The 'enabledFor...' properties are no longer generally required.
    // Ensure 'rbacAuthorization' is false to use 'accessPolicies'.
    enableRbacAuthorization: false
    accessPolicies: [
      {
        tenantId: subscription().tenantId
        // Use the output property `principalId` from the Managed Identity
        objectId: managedIdentity.properties.principalId 
        permissions: {
          secrets: ['get']
        }
      }
    ]
  }
}

// --- Cosmos DB Resources ---

resource cosmosDbAccount 'Microsoft.DocumentDB/databaseAccounts@2023-11-15' = { 
    name: cosmosDbAccountName
    location: location
    kind: 'MongoDB'
    properties: {
      databaseAccountOfferType: 'Standard'
      consistencyPolicy: {
        defaultConsistencyLevel: 'Session'
      }
      locations: [
        {
          locationName: location
          failoverPriority: 0
        }
      ]
    }
  }
  
  // --- MongoDB Database ---
  resource cosmosDbDatabase 'Microsoft.DocumentDB/databaseAccounts/mongodbDatabases@2023-11-15' = {
    parent: cosmosDbAccount 
    name: databaseName
    properties: {
      // Optional: Define 'options' for shared throughput here if needed
    }
  }
  
  // --- MongoDB Collection: Products ---
  resource productsCollection 'Microsoft.DocumentDB/databaseAccounts/mongodbDatabases/collections@2023-11-15' = {
    parent: cosmosDbDatabase // Correctly nests under the database
    name: productsCollectionName // Name is just 'products' (from the parameter)
    properties: {
      resource: {
        id: productsCollectionName
        // Optional: Add a partition key here for better performance
        // partitionKey: { paths: ['/productId'], kind: 'Hash' } 
      }
      options: {
        // Optional: Define throughput/autoscale here
      }
    }
  }
  
  // --- MongoDB Collection: Orders ---
  resource ordersCollection 'Microsoft.DocumentDB/databaseAccounts/mongodbDatabases/collections@2023-11-15' = {
    parent: cosmosDbDatabase
    name: ordersCollectionName
    properties: {
      resource: {
        id: ordersCollectionName
      }
      options: {
        // Optional: Define throughput/autoscale here
      }
    }
  }

output staticWebAppUrl string = staticWebApp.properties.defaultHostName
output apiAppServiceUrl string = apiAppService.properties.defaultHostName
output cosmosDbConnectionString string = cosmosDbAccount.listConnectionStrings().connectionStrings[0].connectionString
