const channel = require("./channel");
const text = require("./text");

const router = message => {
  // Join/leave the user's voice channel
  if (message.content.toLowerCase().startsWith(".join")) channel.join(message);
  if (message.content.toLowerCase().startsWith(".leave"))
    channel.leave(message);

  // ｖａｐｏｒｗａｖｅ ｔｅｘｔ
  if (message.content.toLowerCase().startsWith(".vaporwave"))
    text.vaporwave(message);
};

module.exports = router;
