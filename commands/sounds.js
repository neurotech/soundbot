const client = require("../discord/discord-client");
const config = require("../config");
const db = require("../db");
const library = require("../library");
const rollbar = require("../rollbar-client");

let sounds = {
  play: message => {
    const voiceChannel = message.member.voiceChannel;
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

    let chunked = message.content.split(" ");
    let sound = chunked.slice(1).join(" ");
    let file = Object.keys(library).reduce(function(acc, key) {
      if (library[key].id === sound) {
        return library[key].file;
      } else {
        return acc;
      }
    }, []);

    if (typeof file === "string") {
      voiceChannel.join().then(connection => {
        connection.playFile(`./${config.paths.sounds}/${file}`);
      });
    } else {
      message.author.send(
        `:warning: I couldn't find the requested sound!\n\n        You requested: \`${
          message.content
        }\``
      );
    }
    message.delete(200);
  },
  random: (message, id, callback) => {
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
          rollbar.error(error);
        });
        stream.on("end", end => {
          setTimeout(() => {
            if (message) message.delete(200);
            if (message === null) return callback(null, lastSoundPlayed);
          }, 1000);
        });
      })
      .catch(rollbar.error);
  }
};

module.exports = sounds;
