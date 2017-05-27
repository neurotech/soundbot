const Discord = require('discord.js');
const symbols = require('log-symbols');
const dateFormat = require('dateformat');
const config = require('./config');
const router = require('./commands/router');
const client = new Discord.Client();

client.login(config.discord.token);

// When ready, set currently playing game to help message
client.on('ready', () => {
  client.user.setGame('Type .list for help');
  console.log(symbols.success, ` [${dateFormat()}] Soundbot online.`);
});

// Watch for message
client.on('message', message => {
  // Ignore DMs and only respond to messages from text channels.
  if (message.channel.type !== 'text') { return; }

  // Send message to router
  router(message);
});

// Re-login if client goes offline
setInterval(() => {
  if (client.status === 1) {
    console.log(symbols.error, ` [${dateFormat()}] Soundbot lost connection to Discord!`);
    client.login(config.discord.token)
      .then(() => {
        console.log(symbols.success, ` [${dateFormat()}] Soundbot re-connected to Discord.`);
      });
  }
}, 1000 * 30);

// Log out on process exit/uncaught exception
process.on('exit', () => { client.destroy(); });
process.on('uncaughtException', () => { client.destroy(); });
