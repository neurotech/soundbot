const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');
const say = require('say');
const config = require('./config');
const details = require('./package.json');
const library = require('./library');
const utils = require('./utils');
const help = require('./help');
const client = new Discord.Client();

client.on('ready', () => {
  client.user.setGame('Type .list for help');
});

client.login(config.discord.token);
client.on('message', message => {
  // Join/leave the user's voice channel
  if (message.content.startsWith('.join')) {
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
  }
  if (message.content.startsWith('.leave')) {
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
  }

  // Clean out speech directory
  if (message.content.startsWith('.clean')) {
    let user = message.member.user.username;
    if (config.admins.indexOf(user) > -1) {
      let items = fs.readdirSync(`${config.paths.speech}`);
      if (items.length > 0) {
        message.author.send(`:white_check_mark: Access granted! Deleting **${items.length}** items from \`${config.paths.speech}\`...`);
        for (const item of items) {
          fs.unlink(path.join(`${config.paths.speech}`, item), err => {
            if (err) throw err;
          });
        }
        fs.writeFileSync(`${config.paths.speech}/.keep`, '');
      } else {
        message.author.send(`There are no files to clean up.`);
      }
    } else {
      message.author.send(`:skull_crossbones: You are not authorised to perform this action.`);
    }
  }

  // Say something
  if (message.content.startsWith('.say')) {
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
        let filename = `${config.paths.speech}/${encoded}.wav`;
        if (fs.existsSync(filename)) {
          connection.playFile(filename);
        } else {
          say.export(phrase, config.discord.voice, 1, filename, function (err) {
            if (err) { return console.error(err); }
            connection.playFile(filename);
          });
        }
      });
  }

  // Play file
  if (message.content.startsWith('.play')) {
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
          connection.playFile(`${config.paths.sounds}/${file}`);
        });
    } else {
      message.author.send(`:warning: I couldn't find the requested sound!\n\n        You requested: \`${message.content}\``);
    }
  }

  // Help messages
  if (message.content.startsWith('.list')) {
    const embed = new Discord.RichEmbed()
      .setColor(config.palette.green)
      .setTitle(`**Hello, I'm Soundbot** (\`Version ${details.version}\`)`)
      .setDescription(`I will respond to the following commands:`)
      .addField(`**:scroll: General:**`, help.general, false)
      .addField(`**:musical_keyboard: Sounds:**`, help.sounds, false)
      .addField(`**:speech_balloon: Speech:**`, help.speech, false);

    message.author.send({embed});
  }
  if (message.content.startsWith('.sounds')) {
    let selection = [];
    let subSample = library.sort(() => Math.random() * 2 - 1);
    let random = subSample.slice(0, 5);
    for (var i = 0; i < random.length; i++) {
      selection.push({ sound: random[i].id, description: random[i].description });
    }
    const embed = new Discord.RichEmbed()
      .setColor(config.palette.blue)
      .setThumbnail('https://raw.githubusercontent.com/neurotech/soundbot/master/images/megaman_walk.gif')
      .addField(`\`Soundbot Sound Library\``, `:arrow_right: [Click here to see the full list of sounds.](${config.soundlist})\n\n**Here's 5 random sounds:**`, false)
      .addField(`\`.play ${selection[0].sound}\``, `*${selection[0].description}*\n`, false)
      .addField(`\`.play ${selection[1].sound}\``, `*${selection[1].description}*\n`, false)
      .addField(`\`.play ${selection[2].sound}\``, `*${selection[2].description}*\n`, false)
      .addField(`\`.play ${selection[3].sound}\``, `*${selection[3].description}*\n`, false)
      .addField(`\`.play ${selection[4].sound}\``, `*${selection[4].description}*`, false);
    message.author.send({embed});
  }
});

process.on('exit', () => {
  client.destroy();
});

process.on('uncaughtException', () => {
  client.destroy();
});
