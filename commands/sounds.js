const config = require('../config');
const library = require('../library');

let sounds = {
  play: (message) => {
    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) {
      return message.author.send({
        embed: {
          color: config.palette.red,
          title: `:warning: **You are not in a voice channel!**`,
          description: `I can't play your requested sound as you're not in a voice channel. Please join a voice channel and then make your request again.`,
          fields: [
            {
              name: 'For reference, your request was:',
              value: `\`\`\`\n${message.content}\n\`\`\``
            }
          ]
        }
      });
    }

    let chunked = message.content.split(' ');
    let sound = chunked.slice(1).join(' ');
    let file = Object.keys(library).reduce(function (acc, key) {
      if (library[key].id === sound) {
        return library[key].file;
      } else {
        return acc;
      }
    }, []);

    if (typeof file === 'string') {
      voiceChannel.join()
        .then(connection => {
          connection.playFile(`./${config.paths.sounds}/${file}`);
        });
    } else {
      message.author.send(`:warning: I couldn't find the requested sound!\n\n        You requested: \`${message.content}\``);
    }
    message.delete(200);
  },
  random: (message) => {
    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) {
      return message.author.send({
        embed: {
          color: config.palette.red,
          title: `:warning: **You are not in a voice channel!**`,
          description: `I can't play a random sound as you're not in a voice channel. Please join a voice channel and then make your request again.`,
          fields: [
            {
              name: 'For reference, your request was:',
              value: `\`\`\`\n${message.content}\n\`\`\``
            }
          ]
        }
      });
    }

    voiceChannel.join()
      .then(connection => {
        let selection = library.sort(() => Math.random() * 2 - 1);
        let random = selection.slice(0, 1);
        connection.playFile(`./${config.paths.sounds}/${random[0].file}`);
      });
    message.delete(200);
  }
};

module.exports = sounds;
