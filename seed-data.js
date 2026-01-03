const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://jrichmondgates10_db_user:CL2cnJTz0Csyhzct@lumo.5rgfd1e.mongodb.net/lumo-bot?appName=Lumo';
const client = new MongoClient(MONGODB_URI);

async function seedData() {
  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection('serversettings');

    // Sample test data
    const testData = [
      {
        guildId: '123456789012345678',
        prefix: '!',
        modules: {
          moderation: {
            enabled: true,
            commands: {
              warn: {
                enabled: true,
                allowedChannels: [],
                ignoredChannels: ['555555555555555555'],
                allowedRoles: ['444444444444444444'],
                ignoredRoles: [],
              },
              kick: {
                enabled: true,
                allowedChannels: [],
                ignoredChannels: [],
                allowedRoles: ['444444444444444444'],
                ignoredRoles: [],
              },
              ban: {
                enabled: true,
                allowedChannels: [],
                ignoredChannels: [],
                allowedRoles: ['444444444444444444'],
                ignoredRoles: [],
              },
            },
          },
          utilities: {
            enabled: true,
            commands: {
              userinfo: {
                enabled: true,
                allowedChannels: [],
                ignoredChannels: [],
                allowedRoles: [],
                ignoredRoles: [],
              },
              ping: {
                enabled: true,
                allowedChannels: [],
                ignoredChannels: [],
                allowedRoles: [],
                ignoredRoles: [],
              },
            },
          },
          fun: {
            enabled: true,
            commands: {
              eightball: {
                enabled: true,
                allowedChannels: [],
                ignoredChannels: [],
                allowedRoles: [],
                ignoredRoles: [],
              },
            },
          },
        },
        configuration: {
          botNickname: 'Luno Bot',
          timezone: 'UTC',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Insert test data
    const result = await collection.insertMany(testData);
    console.log(`✓ Inserted ${result.insertedCount} test server(s)`);
    console.log('Test Guild ID: 123456789012345678');
    console.log('\nYou can now use this guildId in your dashboard to test the settings.');
    
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await client.close();
  }
}

seedData();
