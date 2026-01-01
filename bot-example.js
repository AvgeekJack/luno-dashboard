/**
 * Discord Bot - MongoDB Integration
 * 
 * This file shows how to connect your existing bot to MongoDB
 * and read settings from the Luno Dashboard.
 * 
 * Add this to your bot project:
 * npm install mongodb
 */

const { MongoClient } = require('mongodb');
require('dotenv').config();

// MongoDB Connection
const mongoClient = new MongoClient(process.env.MONGODB_URI);
let db;

async function connectDatabase() {
  await mongoClient.connect();
  db = mongoClient.db(); // Uses database from connection string
  console.log('✓ Connected to MongoDB');
}

// Cache for server settings (reload every 5 minutes)
const settingsCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function getServerSettings(guildId) {
  const cached = settingsCache.get(guildId);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const settings = await db.collection('serversettings').findOne({ guildId });
  
  if (settings) {
    settingsCache.set(guildId, {
      data: settings,
      timestamp: Date.now(),
    });
  }

  return settings || {
    guildId,
    prefix: '!',
    commands: {},
    moderation: { enabled: true },
    welcome: { enabled: false },
    goodbye: { enabled: false },
  };
}

// Export for use in your bot
module.exports = {
  connectDatabase,
  getServerSettings,
  mongoClient,
};

// If running this file directly, just connect
if (require.main === module) {
  connectDatabase().catch(console.error);
}

