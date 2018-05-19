module.exports = io => {
  let queueState = [];

  io.on("connection", function(socket) {
    socket.emit("queue:populate", queueState);
    let blob = {};
    setTimeout(() => {
      socket.emit("queue:remove-item", blob);
    }, 3500);
    setTimeout(() => {
      socket.emit("queue:add-item", blob);
    }, 4000);
  });
};
