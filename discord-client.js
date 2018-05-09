const Discord = require("discord.js");
const config = require("./config");

const client = new Discord.Client();

client.login(config.discord.token);

module.exports = client;
