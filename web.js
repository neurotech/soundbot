const SeaLion = require("sea-lion");
const log = require("./log");
const sounds = require("./commands/sounds");

var router = new SeaLion({
  "/": function(request, response, tokens) {},
  "/command/randomsound": function(request, response, tokens) {
    var channelId = "443728931128999936";
    sounds.random(null, channelId);

    response.writeHead(200);
    response.write(JSON.stringify({ status: "OK" }));
    response.end();
  }
});

module.exports = {
  start: port => {
    var port = port ? port : 4567;
    require("http")
      .createServer(router.createHandler())
      .listen(port);
    log("info", "Started web server.");
  }
};
