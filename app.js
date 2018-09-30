const log = require("./log");
const config = require("./config");
const db = require("./db");
const setup = require("./setup");
const web = require("./web");
const tasks = require("./tasks");
const client = require("./discord/discord-client");
const router = require("./commands/router");

db.defaults(config.db.defaults).write();
setup((err, results) => {
  if (err) {
    log("error", err);
  } else {
    log(
      "info",
      `DND Mode is ${db.get("state.dnd").value() === 0 ? "off" : "on"}.`
    );
    log(
      "success",
      `DB seeded with ${results.text.length} text and ${
        results.voice.length
      } voice channels.`
    );

    // Start the web server
    web.start();

    // Schedule recurring tasks
    tasks.schedule((err, tasks) => {
      if (err) {
        log("error", err);
      } else {
        log("success", `Scheduled ${tasks} tasks.`);
      }
    });

    // When ready, set currently playing game to help message
    client.on("ready", () => {
      client.user
        .setActivity("https://soundbot.now.sh", {
          type: "WATCHING"
        })
        .then(presence => log("success", "Soundbot online."))
        .catch(err => log("error", error.message));
    });

    // Watch for messages
    client.on("message", message => {
      // Ignore DMs and only respond to messages from text channels.
      if (message.channel.type !== "text") return;
      if (message.author.id === client.user.id) return;

      // Send the message to router
      router(message);
    });

    // Try to re-login if client goes offline
    setInterval(() => {
      if (client.status === 1) {
        log("warning", "Soundbot lost connection to Discord!");
        client.login(config.discord.token).then(() => {
          log("success", "Soundbot re-connected to Discord.");
        });
      }
    }, 1000 * 30);
  }
});

// Log out on process exit/uncaught exception/unhandled rejection
process.on("exit", () => {
  client.destroy();
  log("error", "Shutting down Soundbot.");
});
process.on("uncaughtException", err => {
  client.destroy();
  log("error", `Uncaught exception!`);
  if (err.code) log("error", err.code);
  if (err.message) log("error", err.message);
  log("error", err.stack);
  process.exit(1);
});
process.on("unhandledRejection", (reason, p) => {
  client.destroy();
  log("error", `Unhandled Rejection: ${reason.stack}`);
});
