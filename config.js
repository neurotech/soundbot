let config = {
  discord: {
    token: process.env.SOUNDBOT_TOKEN,
    guildId: process.env.SOUNDBOT_GUILD_ID,
    blacklist: {
      text: process.env.SOUNDBOT_TEXT_BLACKLIST.split(","),
      voice: process.env.SOUNDBOT_VOICE_BLACKLIST.split(",")
    }
  },
  rollbar: {
    serverToken: process.env.SOUNDBOT_ROLLBAR_SERVER_TOKEN
  },
  admins: process.env.SOUNDBOT_ADMINS,
  soundlist: process.env.SOUNDBOT_SOUNDLISTURL,
  paths: {
    sounds: "sounds"
  },
  db: {
    defaults: {
      discord: {
        channels: {
          text: [],
          voice: []
        }
      },
      state: {
        queue: [],
        isSoundPlaying: 0,
        dnd: 0
      }
    }
  },
  palette: {
    blue: 0x5077f3,
    red: 0xff4949,
    green: 0x12ce66,
    yellow: 0xf7ba2a,
    orange: 0xee7f20,
    purple: 0xbe87ec,
    pink: 0xee7ecd,
    teal: 0x63e7c8
  }
};

module.exports = config;
