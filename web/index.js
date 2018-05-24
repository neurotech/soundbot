const http = require("http");
const SeaLion = require("sea-lion");
const Dion = require("dion");
const seaLion = new SeaLion();
const dion = new Dion(seaLion);
const authom = require("authom");

const config = require("../config");
const db = require("../db");
const discord = require("./auth/discord");
const log = require("../log");
const api = require("./api");
const commands = require("./commands");

let mimeTypes = {
  ".css": "text/css",
  ".js": "application/javascript",
  ".map": "application/octet-stream",
  ".svg": "image/svg+xml",
  ".gif": "image/gif",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
  ".woff": "font/woff"
};

seaLion.add({
  "/": {
    GET: dion.serveFile("./build/index.html", "text/html")
  },
  "/login": {
    GET: dion.serveFile("./build/login/index.html", "text/html")
  },
  "/`path...`": {
    GET: dion.serveDirectory("./build", mimeTypes)
  },
  "/api/discord/channels": {
    GET: api.web.discord.channels
  },
  "/api/sounds/list": {
    GET: api.web.sounds.list
  },
  "/command/randomsound/`channelId`": {
    POST: commands.sound.random
  },
  "/command/playsound/`channelId`": {
    POST: commands.sound.play
  },
  "/command/sentence/`channelId`": {
    POST: commands.text.sentence
  },
  "/command/tts-sentence/`channelId`": {
    POST: commands.text.ttsSentence
  },
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

let port = 4567;
let queueState = db.get("queue.items").value() || 0;
let server = http.createServer(seaLion.createHandler());
let io = require("socket.io")(server);
let queue = require("../action-queue").context(io);

io.on("connection", function(socket) {
  socket.emit("queue:populate", queueState);
});

module.exports = {
  start: () => {
    authom.listen(server);
    server.listen(port);
    log("info", `Started web server on port ${port}.`);
  }
};
