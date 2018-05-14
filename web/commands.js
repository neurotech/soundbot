const sounds = require("../commands/sounds");
const db = require("../db");
const util = require("./util");
const log = require("../log");

let commands = {
  dnd: (request, response, tokens) => {
    if (tokens.onOff && typeof tokens.onOff === "string") {
      var state = 0;
      if (tokens.onOff === "on") state = 1;
      if (tokens.onOff === "off") state = 0;
      db.set("state.dnd", state).write();
      var result = `DND Mode is now ${tokens.onOff.toUpperCase()}.`;
      log("info", result);
      util.sendResponse(200, "OK", result, response);
    } else if (tokens.onOff === "") {
      let dnd = db.get("state.dnd").value();
      let dndState = dnd === 1 ? "on" : "off";
      util.sendResponse(200, "OK", dndState, response);
    }
  },
  sound: {
    play: function(request, response, tokens) {
      let dnd = db.get("state.dnd").value();
      let payload = "";
      if (dnd === 1) {
        util.sendResponse(
          503,
          "UNAVAILABLE",
          "Do not disturb is on.",
          response
        );
      } else {
        request.on("data", function(data) {
          payload += data;
        });
        request.on("end", function() {
          let soundObject = JSON.parse(payload);
          if (tokens.channelId && typeof tokens.channelId === "string") {
            var channelId = tokens.channelId.toString();
            var isValidChannelId = db
              .get("discord.channels.voice")
              .find({ id: channelId })
              .value();

            if (isValidChannelId) {
              sounds.play(null, channelId, soundObject, (err, result) => {
                if (err) util.sendResponse(400, "ERROR", err, response);
                util.sendResponse(200, "OK", result, response);
              });
            } else {
              util.sendResponse(400, "ERROR", "Invalid channel ID!", response);
            }
          }
        });
      }
    },
    random: function(request, response, tokens) {
      var dnd = db.get("state.dnd").value();
      if (dnd === 1) {
        util.sendResponse(
          503,
          "UNAVAILABLE",
          "Do not disturb is on.",
          response
        );
      } else {
        if (tokens.channelId && typeof tokens.channelId === "string") {
          var channelId = tokens.channelId.toString();
          var isValidChannelId = db
            .get("discord.channels.voice")
            .find({ id: channelId })
            .value();

          if (isValidChannelId) {
            sounds.random(null, channelId, (err, result) => {
              if (err) util.sendResponse(400, "ERROR", err, response);
              util.sendResponse(200, "OK", result, response);
            });
          } else {
            util.sendResponse(400, "ERROR", "Invalid channel ID!", response);
          }
        }
      }
    }
  }
};

module.exports = commands;
