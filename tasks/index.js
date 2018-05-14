const schedule = require("node-schedule");
const discord = require("../discord/discord-api");
const db = require("../db");
const log = require("../log");

let hourly = new schedule.RecurrenceRule();
hourly.minute = 0;

const tasks = {
  schedule: callback => {
    schedule.scheduleJob(hourly, () => {
      discord.getChannels((err, channels) => {
        if (err) return callback(err);
        db.set("discord.channels", channels).write();
        log(
          "success",
          `DB updated with ${channels.text.length} text and ${
            channels.voice.length
          } voice channels.`
        );
      });
    });
    callback(null, 1);
  }
};

module.exports = tasks;
