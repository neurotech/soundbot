const crypto = require("crypto");
const sounds = require("../commands/sounds");
const sentence = require("../commands/sentence");
const db = require("../db");
const validate = require("./auth/validate");
const util = require("./util");
const log = require("../log");
const queue = require("../action-queue");

let commands = {
  dnd: (request, response, tokens) => {
    validate(request.headers.authorization, (err, data) => {
      if (err) log.error(err);
      let valid = data;
      if (valid) {
        if (tokens.onOff) {
          var state = 0;
          if (tokens.onOff === "on") state = 1;
          if (tokens.onOff === "off") state = 0;
          db.set("state.dnd", state).write();
          let result = `DND Mode is now ${tokens.onOff.toUpperCase()}.`;
          log.info(result);
          util.sendResponse(200, "OK", result, response);
        } else if (tokens.onOff === "") {
          let dnd = db.get("state.dnd").value();
          let dndState = dnd === 1 ? "on" : "off";
          util.sendResponse(200, "OK", dndState, response);
        }
      } else {
        util.sendResponse(
          401,
          "Unauthorized",
          "You are not authorized to perform this action.",
          response
        );
      }
    });
  },
  sound: {
    play: function(request, response, tokens) {
      validate(request.headers.authorization, (err, data) => {
        if (err) log.error(err);
        let valid = data;
        if (valid) {
          let dnd = db.get("state.dnd").value();
          let payload = "";
          if (dnd === 1) {
            util.sendResponse(
              503,
              "Unavailable",
              "Do not disturb is on.",
              response
            );
          } else {
            request.on("data", function(data) {
              payload += data;
            });
            request.on("end", function() {
              let soundObject = JSON.parse(payload);
              if (tokens.channelId) {
                var channelId = tokens.channelId.toString();
                var isValidChannelId = db
                  .get("discord.channels.voice")
                  .find({ id: channelId })
                  .value();

                if (isValidChannelId) {
                  let queueId = crypto.randomBytes(16).toString("hex");
                  queue.add(
                    function(cb) {
                      sounds.play(
                        channelId,
                        soundObject,
                        queueId,
                        (err, result) => {
                          if (err)
                            util.sendResponse(400, "ERROR", err, response);
                          util.sendResponse(200, "OK", result, response);
                          cb(null, result);
                        }
                      );
                    },
                    {
                      queueId: queueId,
                      username: soundObject.author,
                      soundId: soundObject.id,
                      action: "Sound",
                      tag: "tag-pink",
                      destination: "📢 " + isValidChannelId.name
                    }
                  );
                } else {
                  util.sendResponse(
                    400,
                    "ERROR",
                    "Invalid channel ID!",
                    response
                  );
                }
              }
            });
          }
        } else {
          util.sendResponse(
            401,
            "Unauthorized",
            "You are not authorized to perform this action.",
            response
          );
        }
      });
    },
    random: function(request, response, tokens) {
      validate(request.headers.authorization, (err, data) => {
        if (err) log.error(err);
        let valid = data;
        if (valid) {
          let dnd = db.get("state.dnd").value();
          let payload = "";
          if (dnd === 1) {
            util.sendResponse(
              503,
              "Unavailable",
              "Do not disturb is on.",
              response
            );
          } else {
            request.on("data", function(data) {
              payload += data;
            });
            request.on("end", function() {
              let author = JSON.parse(payload);
              if (tokens.channelId) {
                var channelId = tokens.channelId.toString();
                var isValidChannelId = db
                  .get("discord.channels.voice")
                  .find({ id: channelId })
                  .value();

                if (isValidChannelId) {
                  let queueId = crypto.randomBytes(16).toString("hex");
                  queue.add(
                    function(cb) {
                      sounds.random(channelId, queueId, (err, result) => {
                        if (err) util.sendResponse(400, "ERROR", err, response);
                        util.sendResponse(200, "OK", result, response);
                        cb(null, result);
                      });
                    },
                    {
                      queueId: queueId,
                      username: author,
                      action: "Random Sound",
                      tag: "tag-indigo",
                      destination: "📢 " + isValidChannelId.name
                    }
                  );
                } else {
                  util.sendResponse(
                    400,
                    "ERROR",
                    "Invalid channel ID!",
                    response
                  );
                }
              }
            });
          }
        } else {
          util.sendResponse(
            401,
            "Unauthorized",
            "You are not authorized to perform this action.",
            response
          );
        }
      });
    }
  },
  text: {
    sentence: function(request, response, tokens) {
      validate(request.headers.authorization, (err, data) => {
        if (err) log.error(err);
        let valid = data;
        if (valid) {
          var dnd = db.get("state.dnd").value();
          if (dnd === 1) {
            util.sendResponse(
              503,
              "Unavailable",
              "Do not disturb is on.",
              response
            );
          } else {
            let payload = "";
            request.on("data", function(data) {
              payload += data;
            });
            request.on("end", function() {
              let author = payload;
              if (tokens.channelId) {
                var channelId = tokens.channelId.toString();
                var isValidChannelId = db
                  .get("discord.channels.text")
                  .find({ id: channelId })
                  .value();

                if (isValidChannelId) {
                  let queueId = crypto.randomBytes(16).toString("hex");
                  queue.add(
                    function(cb) {
                      sentence.sentence(
                        channelId,
                        author,
                        queueId,
                        (err, result) => {
                          if (err) {
                            util.sendResponse(400, "ERROR", err, response);
                          }
                          util.sendResponse(200, "OK", result, response);
                          cb(null, result);
                        }
                      );
                    },
                    {
                      queueId: queueId,
                      username: author,
                      action: "Text Sentence",
                      tag: "tag-green",
                      destination: "🔵 " + isValidChannelId.name
                    }
                  );
                } else {
                  util.sendResponse(
                    400,
                    "ERROR",
                    "Invalid channel ID!",
                    response
                  );
                }
              }
            });
          }
        } else {
          util.sendResponse(
            401,
            "Unauthorized",
            "You are not authorized to perform this action.",
            response
          );
        }
      });
    },
    ttsSentence: function(request, response, tokens) {
      validate(request.headers.authorization, (err, data) => {
        if (err) log.error(err);
        let valid = data;
        if (valid) {
          var dnd = db.get("state.dnd").value();
          if (dnd === 1) {
            util.sendResponse(
              503,
              "Unavailable",
              "Do not disturb is on.",
              response
            );
          } else {
            let payload = "";
            request.on("data", function(data) {
              payload += data;
            });
            request.on("end", function() {
              let author = payload;
              if (tokens.channelId) {
                var channelId = tokens.channelId.toString();
                var isValidChannelId = db
                  .get("discord.channels.text")
                  .find({ id: channelId })
                  .value();

                if (isValidChannelId) {
                  let queueId = crypto.randomBytes(16).toString("hex");
                  queue.add(
                    function(cb) {
                      sentence.tts(
                        channelId,
                        author,
                        queueId,
                        (err, result) => {
                          if (err) {
                            util.sendResponse(400, "ERROR", err, response);
                          }
                          util.sendResponse(200, "OK", result, response);
                          cb(null, result);
                        }
                      );
                    },
                    {
                      queueId: queueId,
                      username: author,
                      action: "TTS Sentence",
                      tag: "tag-azure",
                      destination: "🔵 " + isValidChannelId.name
                    }
                  );
                } else {
                  util.sendResponse(
                    400,
                    "ERROR",
                    "Invalid channel ID!",
                    response
                  );
                }
              }
            });
          }
        } else {
          util.sendResponse(
            401,
            "Unauthorized",
            "You are not authorized to perform this action.",
            response
          );
        }
      });
    }
  }
};

module.exports = commands;
