const OAuth2 = require("authom/lib/services/oauth2");
const util = require("util");

function Discord(options) {
  this.code = {
    protocol: "https",
    host: "discordapp.com",
    pathname: "/api/oauth2/authorize",
    query: {
      response_type: "code",
      client_id: options.id,
      scope: options.scope
    }
  };

  this.token = {
    method: "POST",
    host: "discordapp.com",
    path: "/api/oauth2/token",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    query: {
      client_id: options.id,
      client_secret: options.secret,
      grant_type: "authorization_code"
    }
  };

  this.user = {
    method: "POST",
    host: "discordapp.com",
    path: "/api/oauth2/token",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    query: {
      client_id: options.id,
      client_secret: options.secret,
      grant_type: "client_credentials"
    }
  };

  this.on("request", this.onRequest.bind(this));

  OAuth2.call(this, options);
}

util.inherits(Discord, OAuth2);

module.exports = Discord;
