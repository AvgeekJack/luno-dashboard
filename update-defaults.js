const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://jrichmondgates10_db_user:CL2cnJTz0Csyhzct@lumo.5rgfd1e.mongodb.net/lumo-bot?appName=Lumo';
const client = new MongoClient(MONGODB_URI);

async function updateDefaults() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const collection = db.collection('sitesettings');

    // Update Fun module default to enabled
    await collection.updateOne(
      { settingKey: 'defaultModuleFun' },
      { 
        $set: { 
          settingKey: 'defaultModuleFun', 
          settingValue: true, 
          description: 'Default state for Fun module' 
        } 
      },
      { upsert: true }
    );
    console.log('✓ Updated defaultModuleFun to true');

    // Update Utilities module default to enabled
    await collection.updateOne(
      { settingKey: 'defaultModuleUtilities' },
      { 
        $set: { 
          settingKey: 'defaultModuleUtilities', 
          settingValue: true, 
          description: 'Default state for Utilities module' 
        } 
      },
      { upsert: true }
    );
    console.log('✓ Updated defaultModuleUtilities to true');

    // Verify Moderation is enabled (should already be true)
    await collection.updateOne(
      { settingKey: 'defaultModuleModeration' },
      { 
        $set: { 
          settingKey: 'defaultModuleModeration', 
          settingValue: true, 
          description: 'Default state for Moderation module' 
        } 
      },
      { upsert: true }
    );
    console.log('✓ Verified defaultModuleModeration is true');

    console.log('\n✅ Database defaults updated successfully!');
    console.log('\nDefault enabled modules:');
    console.log('- Moderation (with lockdown/unlockdown disabled)');
    console.log('- Fun');
    console.log('- Utilities');
    
  } catch (error) {
    console.error('Error updating defaults:', error);
  } finally {
    await client.close();
  }
}

updateDefaults();
