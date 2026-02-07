// Test script to verify MongoDB defaults are saving correctly
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'lumo-bot';

console.log('MongoDB URI:', MONGODB_URI ? 'Found' : 'NOT FOUND');
console.log('Database:', DB_NAME);

const SiteSettingsSchema = new mongoose.Schema({
  settingKey: {
    type: String,
    required: true,
    unique: true,
  },
  settingValue: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  description: {
    type: String,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  updatedBy: {
    type: String,
  },
});

const SiteSettings = mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);

async function testDefaults() {
  try {
    console.log('\n=== Connecting to MongoDB ===');
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      dbName: DB_NAME,
    });
    console.log('✓ Connected successfully');
    console.log('Database:', mongoose.connection.db.databaseName);
    console.log('Collection:', 'sitesettings');

    // Test 1: Save a test default
    console.log('\n=== TEST 1: Saving defaults ===');
    await SiteSettings.findOneAndUpdate(
      { settingKey: 'defaultServerPrefix' },
      { settingValue: '!', updatedAt: new Date() },
      { upsert: true, new: true }
    );
    console.log('✓ Saved defaultServerPrefix = "!"');

    await SiteSettings.findOneAndUpdate(
      { settingKey: 'defaultServerPremium' },
      { settingValue: true, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    console.log('✓ Saved defaultServerPremium = true');

    await SiteSettings.findOneAndUpdate(
      { settingKey: 'defaultModuleModeration' },
      { settingValue: true, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    console.log('✓ Saved defaultModuleModeration = true');

    await SiteSettings.findOneAndUpdate(
      { settingKey: 'defaultModuleFun' },
      { settingValue: true, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    console.log('✓ Saved defaultModuleFun = true');

    // Test 2: Read back the defaults
    console.log('\n=== TEST 2: Reading defaults back ===');
    const prefix = await SiteSettings.findOne({ settingKey: 'defaultServerPrefix' });
    console.log('defaultServerPrefix:', prefix?.settingValue);

    const premium = await SiteSettings.findOne({ settingKey: 'defaultServerPremium' });
    console.log('defaultServerPremium:', premium?.settingValue);

    const moderation = await SiteSettings.findOne({ settingKey: 'defaultModuleModeration' });
    console.log('defaultModuleModeration:', moderation?.settingValue);

    const fun = await SiteSettings.findOne({ settingKey: 'defaultModuleFun' });
    console.log('defaultModuleFun:', fun?.settingValue);

    // Test 3: List all default-related settings
    console.log('\n=== TEST 3: All default settings in database ===');
    const allDefaults = await SiteSettings.find({ 
      settingKey: { $regex: '^default' } 
    });
    console.log(`Found ${allDefaults.length} default settings:`);
    allDefaults.forEach(setting => {
      console.log(`  - ${setting.settingKey}: ${setting.settingValue}`);
    });

    // Test 4: Check collection stats
    console.log('\n=== TEST 4: Collection info ===');
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name).join(', '));
    
    const count = await SiteSettings.countDocuments();
    console.log(`Total SiteSettings documents: ${count}`);

    console.log('\n✓ ALL TESTS PASSED');
  } catch (error) {
    console.error('\n✗ ERROR:', error.message);
    console.error(error);
  } finally {
    await mongoose.connection.close();
    console.log('\nConnection closed');
  }
}

testDefaults();
