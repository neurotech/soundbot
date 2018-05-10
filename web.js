const SeaLion = require("sea-lion");
const tiny = require("tiny-json-http");
const config = require("./config");
const log = require("./log");
const sounds = require("./commands/sounds");

var router = new SeaLion({
  "/": function(request, response, tokens) {},
  "/discord/channels": function(request, response, tokens) {
    var url = `https://discordapp.com/api/guilds/${
      config.discord.guildId
    }/channels`;

    tiny.get(
      { url: url, headers: { Authorization: `Bot ${config.discord.token}` } },
      (err, result) => {
        if (err) {
          response.writeHead(400);
          response.write(JSON.stringify({ message: err }));
        } else {
          var json = processChannelList(result.body);
          response.writeHead(200);
          response.write(json);
        }
        response.end();
      }
    );
  },
  "/command/randomsound": function(request, response, tokens) {
    var channelId = "443728931128999936";
    sounds.random(null, channelId, (err, result) => {
      response.writeHead(200);
      response.write(JSON.stringify({ status: "OK", result: result }));
      response.end();
    });
  }
});

const processChannelList = json => {
  var channels = {
    text: [],
    voice: []
  };

  json.forEach(channel => {
    if (
      channel.type === 0 &&
      config.discord.blacklist.text.indexOf(channel.name) === -1
    )
      channels.text.push({
        id: channel.id,
        name: channel.name,
        position: channel.position
      });

    if (
      channel.type === 2 &&
      config.discord.blacklist.voice.indexOf(channel.name) === -1
    )
      channels.voice.push({
        id: channel.id,
        name: channel.name,
        position: channel.position
      });
  });

  channels.text.sort((a, b) => {
    return a.position > b.position;
  });
  channels.voice.sort((a, b) => {
    return a.position > b.position;
  });

  return JSON.stringify(channels);
};

module.exports = {
  start: port => {
    var port = port ? port : 4567;
    require("http")
      .createServer(router.createHandler())
      .listen(port);
    log("info", "Started web server.");
  }
};
