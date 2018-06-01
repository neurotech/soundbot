const vaporwave = require("vaporwave");
const config = require("../config");

const text = {
  vaporwave: message => {
    let chunked = message.content.split(" ");
    chunked.shift();
    let joined = chunked.join(" ");
    let aesthetic = vaporwave(joined);

    message.delete(200);
    return message.channel.send({
      embed: {
        color: config.palette.teal,
        title: `\`\`\`\n${aesthetic}\n\`\`\``
      }
    });
  }
};

module.exports = text;
