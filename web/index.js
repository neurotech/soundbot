const http = require("http");
const SeaLion = require("sea-lion");
const Dion = require("dion");
const seaLion = new SeaLion();
const dion = new Dion(seaLion);
const websockets = require("./websockets");
const authom = require("authom");

const config = require("../config");
const discord = require("./auth/discord");
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

authom.customServices.discord = discord;
authom.createServer({
  service: "discord",
  id: config.discord.auth.clientId,
  secret: config.discord.auth.clientSecret,
  scope: "identify"
});

authom.on("auth", function(req, res, data) {
  res.writeHead(302, { Location: "/?token=" + data.token });
  res.end();
});

module.exports = {
  start: () => {
    let port = 4567;
    let server = http.createServer(seaLion.createHandler());
    let io = require("socket.io")(server);
    websockets(io);

    authom.listen(server);
    server.listen(port);
    log("info", `Started web server on port ${port}.`);
  }
};
