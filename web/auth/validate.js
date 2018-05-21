const db = require("../../db");
const log = require("../../log");

module.exports = authorization => {
  if (authorization !== null || authorization !== undefined) {
    let chunked = authorization.split("|");
    let username = chunked[0];
    let token = chunked[1];

    let tokens = db.get("tokens").value();
    let validToken = tokens.indexOf(token);

    if (validToken !== -1) {
      return true;
    } else {
      log("warning", `New authentication attempt!`);
      log("warning", `User:  ${username}`);
      log("warning", `Token: ${token}`);
      return false;
    }
  }
};
