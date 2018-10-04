const schedule = require("node-schedule");
const discord = require("../discord/discord-api");
const db = require("../db");
const log = require("../log");

let hourly = new schedule.RecurrenceRule();
hourly.minute = 0;

let minute = 1000 * 60;
let threeMinutes = minute * 5;

const tasks = {
  schedule: callback => {
    schedule.scheduleJob(hourly, () => {
      discord.getChannels((err, channels) => {
        if (err) return callback(err);
        db.set("discord.channels", channels).write();
        log.success(
          `DB updated with ${channels.text.length} text and ${
            channels.voice.length
          } voice channels.`
        );
      });
    });
    let voiceCheck = setInterval(() => {
      let now = new Date();
      let lastPlayed = new Date(db.get("lastSoundPlayedAt").value());
      let currentVoiceChannel = discord.getCurrentVoiceChannel();

      if (currentVoiceChannel) {
        // https://stackoverflow.com/a/15437397
        let diff = now.getTime() - lastPlayed.getTime();
        let diffInMinutes = Math.round(diff / 60000);
        if (diffInMinutes > 5) {
          currentVoiceChannel.connection.playFile("./spoken-words/afk.ogg", {
            volume: 0.85
          });
          setTimeout(() => {
            currentVoiceChannel.leave();
          }, 2500);
        }
      }
    }, threeMinutes);

    callback(null, 2);
  }
};

module.exports = tasks;
