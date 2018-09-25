const db = require("../db");
const validate = require("./auth/validate");
const util = require("./util");

let api = {
  web: {
    discord: {
      channels: function(request, response, tokens) {
        if (request.headers.authorization) {
          validate(request.headers.authorization, (err, data) => {
            if (err) log("error", err);
            let valid = data;
            if (valid) {
              var channels = db.get("discord.channels");
              response.writeHead(200, { "Content-Type": "application/json" });
              response.write(JSON.stringify(channels));
              response.end();
            }
          });
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
