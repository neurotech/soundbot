const fs = require('fs');
const path = require('path');
const say = require('say');
const config = require('../config');
const utils = require('../utils');

const speech = {
  say: (message) => {
    var chunked = message.content.split(' ');
    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) {
      return message.author.send({
        embed: {
          color: config.palette.red,
          title: `:warning: **You are not in a voice channel!**`,
          description: `I can't say your requested phrase as you're not in a voice channel. Please join a voice channel and then make your request again.`,
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
        let phrase = chunked.slice(1).join(' ');
        let encoded = utils.encode(phrase);
        let filename = `./${config.paths.speech}/${encoded}.wav`;
        if (fs.existsSync(filename)) {
          connection.playFile(filename);
        } else {
          say.export(phrase, config.discord.voice, 1, filename, function (err) {
            if (err) { return console.error(err); }
            connection.playFile(filename);
          });
        }
      });
    message.delete(200);
  },
  clean: (message) => {
    let user = message.member.user.username;
    if (config.admins.indexOf(user) > -1) {
      let items = fs.readdirSync(`./${config.paths.speech}`);
      if (items.length > 0) {
        message.author.send(`:white_check_mark: Access granted! Deleting **${items.length}** items from \`./${config.paths.speech}\`...`);
        for (const item of items) {
          fs.unlink(path.join(`./${config.paths.speech}`, item), err => {
            if (err) throw err;
          });
        }
        fs.writeFileSync(`./${config.paths.speech}/.keep`, '');
      } else {
        message.author.send(`There are no files to clean up.`);
      }
    } else {
      message.author.send(`:skull_crossbones: You are not authorised to perform this action.`);
    }
  }
};

module.exports = speech;
