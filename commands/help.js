const Discord = require('discord.js');
const details = require('../package.json');
const config = require('../config');
const library = require('../library');
const list = require('../command_list');

const help = {
  list: (message) => {
    const embed = new Discord.RichEmbed()
      .setColor(config.palette.green)
      .setTitle(`**Hello, I'm Soundbot** (\`Version ${details.version}\`)`)
      .setDescription(`I will respond to the following commands:`)
      .addField(`**:scroll: General:**`, list.general, false)
      .addField(`**:musical_keyboard: Sounds:**`, list.sounds, false)
      .addField(`**:speech_balloon: Speech:**`, list.speech, false);

    message.author.send({embed});
    message.delete(200);
  },
  sounds: (message) => {
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
    message.delete(200);
  }
};

module.exports = help;
