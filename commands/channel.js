const config = require('../config');

const channel = {
  join: (message) => {
    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) {
      return message.author.send({
        embed: {
          color: config.palette.red,
          title: `:warning: **You are not in a voice channel!**`,
          description: `I can't join your voice channel as you're not in one! Please join a voice channel and then make your request again.`,
          fields: [
            {
              name: 'For reference, your request was:',
              value: `\`\`\`\n${message.content}\n\`\`\``
            }
          ]
        }
      });
    }
    voiceChannel.join();
    message.delete(200);
  },
  leave: (message) => {
    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) {
      return message.author.send({
        embed: {
          color: config.palette.red,
          title: `:warning: **You are not in a voice channel!**`,
          description: `I can't leave your voice channel as you're not in one! Please join a voice channel and then make your request again.`,
          fields: [
            {
              name: 'For reference, your request was:',
              value: `\`\`\`\n${message.content}\n\`\`\``
            }
          ]
        }
      });
    }
    voiceChannel.leave();
    message.delete(200);
  }
};

module.exports = channel;
