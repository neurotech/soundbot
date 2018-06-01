const Rollbar = require("rollbar");
const config = require("./config");
const rollbar = new Rollbar(config.rollbar.serverToken);

Rollbar.configure({
  captureUncaught: true,
  captureUnhandledRejections: true
});

module.exports = rollbar;
