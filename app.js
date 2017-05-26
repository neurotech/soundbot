const Discord = require('discord.js');
const config = require('./config');
const router = require('./commands/router');
const client = new Discord.Client();

client.login(config.discord.token);

// When ready, set currently playing game to help message
client.on('ready', () => {
  client.user.setGame('Type .list for help');
});

// Watch for message
client.on('message', message => {
  // Ignore DMs and only respond to messages from text channels.
  if (message.channel.type !== 'text') { return; }

  // Send message to router
  router(message);
});

// Re-login if client goes offline
setInterval(() => { if (client.status === 1) client.login(config.discord.token); }, 1000 * 30);

// Log out on process exit/uncaught exception
process.on('exit', () => { client.destroy(); });
process.on('uncaughtException', () => { client.destroy(); });
