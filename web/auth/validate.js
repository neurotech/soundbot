const AWS = require("aws-sdk");
const rollbar = require("rollbar");
const config = require("../../config");
const db = require("../../db");
const log = require("../../log");

AWS.config.update({
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey
  },
  region: "us-west-1"
});

let dynamo = new AWS.DynamoDB.DocumentClient();

module.exports = (authorization, callback) => {
  if (authorization !== null || authorization !== undefined) {
    let chunked = authorization.split("|");
    let username = chunked[0];
    let token = chunked[1];

    let validationQuery = {
      TableName: "Soundbot",
      ExpressionAttributeValues: {
        ":t": token
      },
      KeyConditionExpression: "discordToken = :t"
    };

    dynamo.query(validationQuery, function(err, data) {
      if (err || data.Items.length === 0) return callback(err);

      if (data.Items.length === 1) {
        callback(null, true);
      } else {
        log(
          "warning",
          `New authentication attempt! User: ${username} Token: ${token}`
        );
        callback(null, false);
      }
    });
  }
};
