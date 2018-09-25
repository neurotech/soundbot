const queue = require("queue");
const db = require("../db");

var io;

let q = queue({
  concurrency: 1,
  autostart: true
});

q.on("success", function(result, job) {
  io.emit("queue:remove-item", { queueId: result.queueId });
  db.get("queue.items")
    .remove({ queueId: result.queueId })
    .write();
});

let cooldown = setInterval(() => {
  let gcd = db.get("globalCoolDown").value();
  if (gcd > 0) {
    db.set("globalCoolDown", gcd - 1).write();
    io.emit("gcd:update", gcd - 1);
  }
}, 1000 * 10);

module.exports = {
  context: importedIO => {
    io = importedIO;
  },
  add: (action, data) => {
    let gcd = db.get("globalCoolDown").value();

    if (gcd < 10) {
      if (
        data.action === "TTS Sentence" ||
        data.action === "Text Sentence" ||
        data.action === "Random Sound"
      ) {
        db.set("globalCoolDown", gcd + 1).write();
        io.emit("gcd:update", gcd + 1);
      }
      q.push(action);
      io.emit("queue:add-item", data);
      db.get("queue.items")
        .push(data)
        .write();

      if (data.action === "Sound") {
        io.emit("library:cooldown-update", data.soundId);
        db.get("library")
          .find({ id: data.soundId })
          .assign({ lastPlayed: new Date(), timeLeft: 60 })
          .write();
      }
    }
  },
  get: () => {
    let status = q.length;
    return status;
  }
};
