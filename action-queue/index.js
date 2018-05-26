const queue = require("queue");
const db = require("../db");

var io;

let q = queue({
  concurrency: 1,
  autostart: true
});

q.on("success", function(result, job) {
  io.emit("queue:remove-item", { queueId: result.queueId });
  db
    .get("queue.items")
    .remove({ queueId: result.queueId })
    .write();
});

module.exports = {
  context: importedIO => {
    io = importedIO;
  },
  add: (action, data) => {
    q.push(action);
    io.emit("queue:add-item", data);
    db
      .get("queue.items")
      .push(data)
      .write();

    io.emit("library:cooldown-update", data.soundId);
    db
      .get("library")
      .find({ id: data.soundId })
      .assign({ lastPlayed: new Date(), timeLeft: 60 })
      .write();
  },
  get: () => {
    let status = q.length;
    return status;
  }
};
