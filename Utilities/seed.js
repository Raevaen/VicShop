const { MongoClient } = require('mongodb');
const { DefaultAzureCredential } = require('@azure/identity');
const { SecretClient } = require('@azure/keyvault-secrets');

// Load environment variables
require('dotenv').config();

async function seedDatabase() {
  try {
    // Retrieve MongoDB connection string from Azure Key Vault
    const keyVaultUri = process.env.KEYVAULT_URI; // Set KEYVAULT_URI as an environment variable
    if (!keyVaultUri) throw new Error('KEYVAULT_URI environment variable is not set.');

    const credential = new DefaultAzureCredential();
    const secretClient = new SecretClient(keyVaultUri, credential);
    const mongoConnectionString = (await secretClient.getSecret('MongoConnection')).value;

    // Connect to MongoDB
    const client = new MongoClient(mongoConnectionString);
    await client.connect();
    const db = client.db('vicshop');

    // Collections
    const productsCollection = db.collection('products');
    const usersCollection = db.collection('users');
    const ordersCollection = db.collection('orders');

    // Create unique index on 'slug'
    await productsCollection.createIndex({ slug: 1 }, { unique: true });

    // Sample products
    const sampleProducts = Array.from({ length: 10 }, (_, i) => ({
      _id: `product${i + 1}`,
      slug: `product-${i + 1}`,
      title: `Product ${i + 1}`,
      description: `Description for product ${i + 1}`,
      price_cents: (i + 1) * 1000,
      images: [`https://example.com/product${i + 1}.jpg`],
      stock: Math.floor(Math.random() * 100) + 1,
    }));

    // Insert sample products
    await productsCollection.insertMany(sampleProducts);

    console.log('Database seeded successfully!');
  } catch (err) {
    console.error('Error seeding database:', err);
  }
}

seedDatabase();
