const util = {
  sendResponse: (code, status, message, response) => {
    response.writeHead(code, { "Content-Type": "application/json" });
    response.write(
      JSON.stringify({
        status: status,
        result: message
      })
    );
    response.end();
  }
};

module.exports = util;
