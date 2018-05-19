const tiny = require("tiny-json-http");
const spacetime = require("spacetime");
const client = require("./discord-client");
const config = require("../config");
const db = require("../db");

module.exports = {
  getChannels: callback => {
    var url = `https://discordapp.com/api/guilds/${
      config.discord.guildId
    }/channels`;

    tiny.get(
      {
        url: url,
        headers: { Authorization: `Bot ${config.discord.token}` }
      },
      (err, result) => {
        if (err) {
          return callback(err);
        } else {
          var json = processChannelList(result.body);
          callback(null, json);
        }
      }
    );
  },
  getCurrentVoiceChannel: () => {
    let connection = client.guilds.first().voiceConnection;
    let channel = null;
    if (connection) channel = connection.channel;

    return channel;
  }
};

let processChannelList = json => {
  var now = spacetime.now();
  var channels = {
    freshness: now.goto("Australia/Sydney").format("nice-day"),
    text: [],
    voice: []
  };

  json.forEach(channel => {
    if (
      channel.type === 0 &&
      config.discord.blacklist.text.indexOf(channel.name) === -1
    )
      channels.text.push({
        id: channel.id,
        name: channel.name,
        position: channel.position
      });

    if (
      channel.type === 2 &&
      config.discord.blacklist.voice.indexOf(channel.name) === -1
    )
      channels.voice.push({
        id: channel.id,
        name: channel.name,
        position: channel.position
      });
  });

  channels.text.sort((a, b) => {
    return a.position > b.position;
  });
  channels.voice.sort((a, b) => {
    return a.position > b.position;
  });

  return channels;
};
