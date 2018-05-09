const symbols = require("log-symbols");
const spacetime = require("spacetime");

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
      break;

    case "error":
      symbolChar = symbols.error;
      break;

    default:
      symbolChar = symbols.info;
      break;
  }

  let logMessage = `[${s
    .goto("Australia/Sydney")
    .format("nice-day")}] ${symbolChar} ${message}`;

  if (symbol === "error") {
    console.error(logMessage);
  } else {
    console.log(logMessage);
  }
};
