const tiny = require("tiny-json-http");
const config = require("../../config");
const log = require("../../log");

module.exports = (authorization, callback) => {
  if (authorization !== null || authorization !== undefined) {
    let chunked = authorization.split("|");
    let token = chunked[1];

    if (token !== null || token !== undefined) {
      let url = "https://discordapp.com/api/users/@me";
      tiny.get(
        {
          url: url,
          headers: { Authorization: `Bearer ${token}` }
        },
        (err, result) => {
          if (err) return callback(err);
          let whitelist = config.access.split("|");
          let username = result.body.username;
          let verified = whitelist.indexOf(username) > -1;
          if (verified) {
            callback(null, true);
          } else {
            log(
              "warning",
              `New authentication attempt! User: ${username} Token: ${token}`
            );
            callback(null, false);
          }
        }
      );
    }
  }
};
