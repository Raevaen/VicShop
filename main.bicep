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
  kind: 'app'
  properties: {
    serverFarmId: appServicePlan.id
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

// // --- Cosmos DB Resources ---

// resource cosmosDbAccount 'Microsoft.DocumentDB/databaseAccounts@2023-11-15' = { 
//     name: cosmosDbAccountName
//     location: location
//     kind: 'MongoDB'
//     properties: {
//       databaseAccountOfferType: 'Standard'
//       consistencyPolicy: {
//         defaultConsistencyLevel: 'Session'
//       }
//       locations: [
//         {
//           locationName: location
//           failoverPriority: 0
//         }
//       ]
//     }
//   }
  
//   // --- MongoDB Database ---
//   resource cosmosDbDatabase 'Microsoft.DocumentDB/databaseAccounts/mongodbDatabases@2023-11-15' = {
//     parent: cosmosDbAccount 
//     name: databaseName
//     properties: {
//       // Optional: Define 'options' for shared throughput here if needed
//     }
//   }
  
//   // --- MongoDB Collection: Products ---
//   resource productsCollection 'Microsoft.DocumentDB/databaseAccounts/mongodbDatabases/collections@2023-11-15' = {
//     parent: cosmosDbDatabase // Correctly nests under the database
//     name: productsCollectionName // Name is just 'products' (from the parameter)
//     properties: {
//       resource: {
//         id: productsCollectionName
//         // Optional: Add a partition key here for better performance
//         // partitionKey: { paths: ['/productId'], kind: 'Hash' } 
//       }
//       options: {
//         // Optional: Define throughput/autoscale here
//       }
//     }
//   }
  
//   // --- MongoDB Collection: Orders ---
//   resource ordersCollection 'Microsoft.DocumentDB/databaseAccounts/mongodbDatabases/collections@2023-11-15' = {
//     parent: cosmosDbDatabase
//     name: ordersCollectionName
//     properties: {
//       resource: {
//         id: ordersCollectionName
//       }
//       options: {
//         // Optional: Define throughput/autoscale here
//       }
//     }
//   }

output staticWebAppUrl string = staticWebApp.properties.defaultHostName
output apiAppServiceUrl string = apiAppService.properties.defaultHostName
// it's better to retrieve the connection string through Key Vault or a dedicated function.
// output cosmosDbConnectionString string = cosmosDbAccount.listConnectionStrings().connectionStrings[0].connectionString
