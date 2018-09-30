const channel = require("./channel");
const text = require("./text");
const replace = require("./replace");

const router = message => {
  // Join/leave the user's voice channel
  if (message.content.toLowerCase().startsWith(".join")) channel.join(message);
  if (message.content.toLowerCase().startsWith(".leave"))
    channel.leave(message);

  // ｖａｐｏｒｗａｖｅ ｔｅｘｔ
  if (message.content.toLowerCase().startsWith(".vaporwave"))
    text.vaporwave(message);

  // Word replacer
  replace(message);
};

module.exports = router;
