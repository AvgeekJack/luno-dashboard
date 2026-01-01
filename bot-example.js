/**
 * Discord Bot Integration Example
 * 
 * This file shows how your Discord bot should connect to MongoDB
 * and read settings from the dashboard.
 * 
 * Install required packages:
 * npm install discord.js mongodb dotenv
 */

const { Client, GatewayIntentBits } = require('discord.js');
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

// Discord Bot Setup
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
});

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

// Bot Ready Event
client.on('ready', async () => {
  console.log(`✓ Bot logged in as ${client.user.tag}`);
  
  // Preload settings for all servers
  const guilds = client.guilds.cache.map(g => g.id);
  for (const guildId of guilds) {
    await getServerSettings(guildId);
  }
  console.log(`✓ Loaded settings for ${guilds.length} servers`);
});

// Welcome New Members
client.on('guildMemberAdd', async (member) => {
  const settings = await getServerSettings(member.guild.id);
  
  if (settings.welcome?.enabled && settings.welcome.channel) {
    const channel = member.guild.channels.cache.get(settings.welcome.channel);
    if (channel) {
      const message = settings.welcome.message
        .replace('{user}', member.user.username)
        .replace('{server}', member.guild.name);
      
      channel.send(message);
    }
  }

  // Assign default roles
  if (settings.roles?.defaultRoles?.length > 0) {
    for (const roleId of settings.roles.defaultRoles) {
      const role = member.guild.roles.cache.get(roleId);
      if (role) {
        await member.roles.add(role).catch(console.error);
      }
    }
  }
});

// Goodbye Members
client.on('guildMemberRemove', async (member) => {
  const settings = await getServerSettings(member.guild.id);
  
  if (settings.goodbye?.enabled && settings.goodbye.channel) {
    const channel = member.guild.channels.cache.get(settings.goodbye.channel);
    if (channel) {
      const message = settings.goodbye.message
        .replace('{user}', member.user.username)
        .replace('{server}', member.guild.name);
      
      channel.send(message);
    }
  }
});

// Message Commands
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;

  const settings = await getServerSettings(message.guild.id);
  const prefix = settings.prefix || '!';

  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  // Check if command exists in settings
  const commandSettings = settings.commands?.[commandName];
  
  // Check if command is enabled
  if (commandSettings && commandSettings.enabled === false) {
    return message.reply('This command is currently disabled.');
  }

  // Check channel permissions
  if (commandSettings?.allowedChannels?.length > 0) {
    if (!commandSettings.allowedChannels.includes(message.channel.id)) {
      return message.reply('This command cannot be used in this channel.');
    }
  }

  if (commandSettings?.ignoredChannels?.includes(message.channel.id)) {
    return message.reply('This command is disabled in this channel.');
  }

  // Check role permissions
  const memberRoles = message.member.roles.cache.map(r => r.id);
  
  if (commandSettings?.allowedRoles?.length > 0) {
    const hasAllowedRole = commandSettings.allowedRoles.some(r => memberRoles.includes(r));
    if (!hasAllowedRole) {
      return message.reply('You do not have the required role to use this command.');
    }
  }

  if (commandSettings?.ignoredRoles?.length > 0) {
    const hasIgnoredRole = commandSettings.ignoredRoles.some(r => memberRoles.includes(r));
    if (hasIgnoredRole) {
      return message.reply('Your role is restricted from using this command.');
    }
  }

  // Check if user has moderator role (for mod commands)
  const isModerator = settings.roles?.modRoles?.some(r => memberRoles.includes(r)) || 
                      message.member.permissions.has('Administrator');

  // Execute Commands
  switch (commandName) {
    case 'warn':
      if (!isModerator) {
        return message.reply('You need moderator permissions to use this command.');
      }
      
      const userToWarn = message.mentions.users.first();
      const reason = args.slice(1).join(' ') || 'No reason provided';
      
      if (!userToWarn) {
        return message.reply('Please mention a user to warn.');
      }

      message.reply(`✓ Warned ${userToWarn.tag} for: ${reason}`);
      
      // Log to mod channel
      if (settings.moderation?.logChannel) {
        const logChannel = message.guild.channels.cache.get(settings.moderation.logChannel);
        if (logChannel) {
          logChannel.send(`**[WARN]** ${message.author.tag} warned ${userToWarn.tag}\nReason: ${reason}`);
        }
      }
      break;

    case 'kick':
      if (!isModerator) {
        return message.reply('You need moderator permissions to use this command.');
      }
      // Implement kick logic
      break;

    case 'ban':
      if (!isModerator) {
        return message.reply('You need moderator permissions to use this command.');
      }
      // Implement ban logic
      break;

    case 'userinfo':
      const user = message.mentions.users.first() || message.author;
      const member = message.guild.members.cache.get(user.id);
      
      message.reply({
        embeds: [{
          title: `User Info: ${user.tag}`,
          fields: [
            { name: 'ID', value: user.id },
            { name: 'Joined', value: member.joinedAt.toDateString() },
            { name: 'Roles', value: member.roles.cache.map(r => r.name).join(', ') || 'None' },
          ],
          color: 0xFF6B35,
        }]
      });
      break;

    case '8ball':
    case 'eightball':
      const responses = [
        'Yes', 'No', 'Maybe', 'Definitely', 'Absolutely not',
        'Ask again later', 'I don\'t think so', 'Without a doubt'
      ];
      const response = responses[Math.floor(Math.random() * responses.length)];
      message.reply(`🎱 ${response}`);
      break;

    case 'ping':
      const ping = Date.now() - message.createdTimestamp;
      message.reply(`🏓 Pong! Latency: ${ping}ms | API: ${client.ws.ping}ms`);
      break;
  }
});

// Start Bot
(async () => {
  await connectDatabase();
  await client.login(process.env.DISCORD_BOT_TOKEN);
})();

// Graceful Shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down...');
  await mongoClient.close();
  client.destroy();
  process.exit(0);
});
