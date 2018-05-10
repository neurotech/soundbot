const client = require("./discord-client");
const log = require("./log");
const config = require("./config");
const web = require("./web");
const router = require("./commands/router");

web.start();

// When ready, set currently playing game to help message
client.on("ready", () => {
  client.user
    .setActivity("for a command from .list", {
      type: "WATCHING"
    })
    .then(presence => log("success", "Soundbot online."))
    .catch(err => log("error", error.message));
});

// Watch for messages
client.on("message", message => {
  // Ignore DMs and only respond to messages from text channels.
  if (message.channel.type !== "text") return;

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

// Log out on process exit/uncaught exception/unhandled rejection
process.on("exit", () => {
  client.destroy();
  log("error", "Shutting down Soundbot.");
});
process.on("uncaughtException", err => {
  client.destroy();
  log("error", `Uncaught exception!`);
  log("error", err.stack);
  process.exit(1);
});
process.on("unhandledRejection", (reason, p) => {
  client.destroy();
  log("error", `Unhandled Rejection: ${reason.stack}`);
});
