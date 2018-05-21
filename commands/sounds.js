const client = require("../discord/discord-client");
const config = require("../config");
const db = require("../db");
const library = require("../library");
const rollbar = require("../rollbar-client");

let sounds = {
  play: (message, channelId, soundObject, queueId, callback) => {
    let voiceChannel = null;
    let sound = null;
    let file = null;

    if (message === null) {
      voiceChannel = client.channels.get(channelId);
      file = soundObject.file;
    } else {
      voiceChannel = message.member.voiceChannel;
      let chunked = message.content.split(" ");
      sound = chunked.slice(1).join(" ");
      file = Object.keys(library).reduce(function(acc, key) {
        if (library[key].id === sound) {
          return library[key].file;
        } else {
          return acc;
        }
      }, []);

      if (!voiceChannel) {
        return message.author.send({
          embed: {
            color: config.palette.red,
            title: `:warning: **You are not in a voice channel!**`,
            description: `I can't play your requested sound as you're not in a voice channel. Please join a voice channel and then make your request again.`,
            fields: [
              {
                name: "For reference, your request was:",
                value: `\`\`\`\n${message.content}\n\`\`\``
              }
            ]
          }
        });
      }
    }

    if (typeof file === "string") {
      db.set("lastSoundPlayedAt", new Date()).write();
      voiceChannel
        .join()
        .then(connection => {
          var stream = connection.playFile(`./${config.paths.sounds}/${file}`);
          stream.on("start", () => {
            connection.player.streamingData.pausedTime = 0;
          });
          stream.on("debug", debug => {
            rollbar.debug(debug);
          });
          stream.on("error", error => {
            return callback(error);
          });
          stream.on("end", end => {
            setTimeout(() => {
              if (message) message.delete(200);
              if (message === null)
                return callback(null, {
                  queueId: queueId
                });
            }, 2000);
          });
        })
        .catch(rollbar.error);
    } else if (message) {
      message.author.send(
        `:warning: I couldn't find the requested sound!\n\n        You requested: \`${
          message.content
        }\``
      );
      message.delete(200);
    }
  },
  random: (message, id, queueId, callback) => {
    let voiceChannel = null;
    if (message === null) {
      voiceChannel = client.channels.get(id);
    } else {
      voiceChannel = message.member.voiceChannel;
    }

    if (!voiceChannel) {
      return message.author.send({
        embed: {
          color: config.palette.red,
          title: `:warning: **You are not in a voice channel!**`,
          description: `I can't play a random sound as you're not in a voice channel. Please join a voice channel and then make your request again.`,
          fields: [
            {
              name: "For reference, your request was:",
              value: `\`\`\`\n${message.content}\n\`\`\``
            }
          ]
        }
      });
    }

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
          rollbar.debug(debug);
        });
        stream.on("error", error => {
          return callback(error);
        });
        stream.on("end", end => {
          setTimeout(() => {
            if (message) message.delete(200);
            if (message === null)
              return callback(null, {
                queueId: queueId
              });
          }, 2000);
        });
      })
      .catch(rollbar.error);
  }
};

module.exports = sounds;
