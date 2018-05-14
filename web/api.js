const tiny = require("tiny-json-http");
const config = require("../config");
const db = require("../db");
const util = require("./util");

let api = {
  web: {
    discord: {
      channels: function(request, response, tokens) {
        var channels = db.get("discord.channels");
        response.writeHead(200, { "Content-Type": "application/json" });
        response.write(JSON.stringify(channels));
        response.end();
      }
    }
  }
};

module.exports = api;
