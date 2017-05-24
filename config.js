let config = {
  discord: {
    token: process.env.DISCORD_SOUNDBOT_TOKEN,
    voice: 'Alex'
  },
  admins: process.env.DISCORD_SOUNDBOT_ADMINS,
  paths: {
    sounds: './sounds',
    speech: './speech'
  },
  palette: {
    blue: 0x5077F3,
    red: 0xFF4949,
    green: 0x12CE66,
    yellow: 0xF7BA2A,
    orange: 0xEE7F20,
    purple: 0xBE87EC,
    pink: 0xEE7ECD,
    teal: 0x63E7C8
  }
};

module.exports = config;
