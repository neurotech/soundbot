const queue = require("queue");

var io;

let q = queue({
  concurrency: 1,
  autostart: true
});

q.on("success", function(result, job) {
  io.emit("queue:remove-item", { queueId: result.queueId });
});

module.exports = {
  context: importedIO => {
    io = importedIO;
  },
  add: (action, data) => {
    q.push(action);
    io.emit("queue:add-item", data);
  },
  get: () => {
    let status = q.length;
    return status;
  }
};
