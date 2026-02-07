const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://jrichmondgates10_db_user:CL2cnJTz0Csyhzct@lumo.5rgfd1e.mongodb.net/lumo-bot?appName=Lumo';
const client = new MongoClient(MONGODB_URI);

async function markExistingServersAsSetup() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const collection = db.collection('serversettings');

    // Update all existing servers to mark setup as completed
    const result = await collection.updateMany(
      { setupCompleted: { $ne: true } }, // Only update servers where setupCompleted is not true
      { 
        $set: { 
          setupCompleted: true,
          setupCompletedAt: new Date()
        } 
      }
    );

    console.log(`✓ Updated ${result.modifiedCount} existing server(s)`);
    console.log('✅ All existing servers marked as setup completed!');
    console.log('\n📝 Note: New servers will now show the welcome setup wizard on first visit.');
    
  } catch (error) {
    console.error('Error updating servers:', error);
  } finally {
    await client.close();
  }
}

markExistingServersAsSetup();
