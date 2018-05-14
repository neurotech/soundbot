const SeaLion = require("sea-lion");
const Dion = require("dion");
const seaLion = new SeaLion();
const dion = new Dion(seaLion);
const log = require("../log");
const api = require("./api");
const commands = require("./commands");

seaLion.add({
  "/": {
    GET: dion.serveFile("./build/index.html", "text/html")
  },
  "/`path...`": {
    GET: dion.serveDirectory("./build", {
      ".css": "text/css",
      ".js": "application/javascript",
      ".svg": "image/svg+xml",
      ".gif": "image/gif",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".woff": "font/woff"
    })
  },
  "/api/discord/channels": {
    GET: api.web.discord.channels
  },
  "/command/randomsound/`channelId`": {
    POST: commands.sound.random
  },
  "/command/playsound/`channelId`": {
    POST: commands.sound.play
  },
  // "/command/sentence/`channelId`": {
  //   POST: commands.text.sentence
  // },
  // "/command/tts-sentence/`channelId`": {
  //   POST: commands.text.ttsSentence
  // },
  "/command/dnd/`onOff`": {
    POST: commands.dnd
  }
});

var router = new SeaLion();

module.exports = {
  start: () => {
    var port = 4567;
    require("http")
      .createServer(seaLion.createHandler())
      .listen(port);
    log("info", `Started web server on port ${port}.`);
  }
};
