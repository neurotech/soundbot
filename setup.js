const db = require("./db");
const config = require("./config");
const discord = require("./discord/discord-api");

module.exports = callback => {
  db.defaults(config.db.defaults).write();

  // Add sounds to library
  let data = require("./sounds.json");
  let sounds = [];
  data.forEach(sound => {
    sound.lastPlayed = null;
    sound.timeLeft = null;
    sounds.push(sound);
  });
  db.set("library", sounds).write();

  // Get list of channnels from Discord API
  discord.getChannels((err, channels) => {
    if (err) return callback(err);
    db.set("discord.channels", channels).write();
    callback(null, channels);
  });
};
