const symbols = require("log-symbols");
const spacetime = require("spacetime");
const rollbar = require("./rollbar-client");

let timestampFormat = "dd-MM-yyyy hh:mm a";

module.exports = (symbol, message) => {
  var s = spacetime.now();
  var symbolChar = null;

  switch (symbol) {
    case "info":
      symbolChar = symbols.info;
      break;

    case "success":
      symbolChar = symbols.success;
      break;

    case "warning":
      symbolChar = symbols.warning;
      rollbar.warning(message);
      break;

    case "error":
      symbolChar = symbols.error;
      rollbar.error(message);
      break;

    default:
      symbolChar = symbols.info;
      break;
  }

  let logMessage = `[${s
    .goto("Australia/Sydney")
    .format(timestampFormat)}] ${symbolChar} ${message}`;

  if (symbol === "error") {
    console.error(logMessage);
  } else {
    console.log(logMessage);
  }
};
