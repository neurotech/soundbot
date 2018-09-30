const client = require("../discord/discord-client");
const config = require("../config");
const db = require("../db");
const library = require("../library");

let sounds = {
  play: (channelId, soundObject, queueId, callback) => {
    let voiceChannel = client.channels.get(channelId);
    let file = soundObject.file;

    db.set("lastSoundPlayedAt", new Date()).write();
    voiceChannel
      .join()
      .then(connection => {
        var stream = connection.playFile(`./${config.paths.sounds}/${file}`);
        stream.on("start", () => {
          connection.player.streamingData.pausedTime = 0;
        });
        stream.on("debug", debug => {
          log("warning", debug);
        });
        stream.on("error", error => {
          return callback(error);
        });
        stream.on("end", end => {
          setTimeout(() => {
            return callback(null, {
              queueId: queueId
            });
          }, 2000);
        });
      })
      .catch(console.error());
  },
  random: (id, queueId, callback) => {
    let voiceChannel = client.channels.get(id);
    let selection = library.sort(() => Math.random() * 2 - 1);
    let random = selection.slice(0, 1);
    let file = `./${config.paths.sounds}/${random[0].file}`;
    let lastSoundPlayed = random[0];

    db.set("lastSoundPlayedAt", new Date()).write();

    voiceChannel
      .join()
      .then(connection => {
        var stream = connection.playFile(file);

        stream.on("start", () => {
          connection.player.streamingData.pausedTime = 0;
        });
        stream.on("debug", debug => {
          log("warning", debug);
        });
        stream.on("error", error => {
          return callback(error);
        });
        stream.on("end", end => {
          setTimeout(() => {
            return callback(null, {
              queueId: queueId
            });
          }, 2000);
        });
      })
      .catch(console.error());
  }
};

module.exports = sounds;
