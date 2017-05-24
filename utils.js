const hash = require('crypto');

let utils = {
  encode: (data) => {
    return hash.createHash('md5').update(data).digest('hex');
  }
};

module.exports = utils;
