const righto = require("righto");
const client = require("../discord/discord-client");
const config = require("../config");
const db = require("../db");
const library = require("../library");
const log = require("../log");

function delay(time, callback) {
  setTimeout(callback, time);
}

function playFile(connection, path, callback) {
  var stream = connection.playFile(path);
  var played = righto(function(done) {
    stream.on("start", () => (connection.player.streamingData.pausedTime = 0));
    stream.on("debug", log.warning);
    stream.on("error", done);
    stream.on("end", () => done());
  });

  played(callback);
}

function play(channelId, soundObject, queueId, callback) {
  var file = soundObject.file;
  db.set("lastSoundPlayedAt", new Date()).write();
  var voiceChannel = client.channels.get(channelId);
  var connection = righto.from(voiceChannel.join());
  var played = righto(playFile, connection, `./${config.paths.sounds}/${file}`)
    .get(() => righto(delay, 2000))
    .get(() => ({ queueId }));

  played(callback);
}

function playRandom(channelId, queueId, callback){
  let selection = library[Math.floor(Math.random() * library.length)];
  play(channelId, file, queueId, callback);
}

module.exports = { play, playRandom };
