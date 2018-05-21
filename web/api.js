const fs = require("fs");
const tiny = require("tiny-json-http");
const config = require("../config");
const db = require("../db");
const validate = require("./auth/validate");
const util = require("./util");

let api = {
  web: {
    discord: {
      channels: function(request, response, tokens) {
        let valid = false;
        if (request.headers.authorization) {
          valid = validate(request.headers.authorization);
        }

        if (valid) {
          var channels = db.get("discord.channels");
          response.writeHead(200, { "Content-Type": "application/json" });
          response.write(JSON.stringify(channels));
          response.end();
        } else {
          util.sendResponse(
            401,
            "Unauthorized",
            "You are not authorized to perform this action.",
            response
          );
        }
      }
    },
    sounds: {
      list: function(request, response, tokens) {
        let valid = false;
        if (request.headers.authorization) {
          valid = validate(request.headers.authorization);
        }

        if (valid) {
          let sounds = require("../sounds.json");
          response.writeHead(200, {
            "Content-Type": "application/json"
          });
          response.write(JSON.stringify(sounds));
          response.end();
        } else {
          util.sendResponse(
            401,
            "Unauthorized",
            "You are not authorized to perform this action.",
            response
          );
        }
      }
    }
  }
};

module.exports = api;
