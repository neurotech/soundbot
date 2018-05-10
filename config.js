let config = {
  discord: {
    token: process.env.DISCORD_SOUNDBOT_TOKEN,
    guildId: process.env.DISCORD_SOUNDBOT_GUILD_ID,
    blacklist: {
      text: process.env.DISCORD_SOUNDBOT_TEXT_CHANNELS_BLACKLIST.split(","),
      voice: process.env.DISCORD_SOUNDBOT_VOICE_CHANNELS_BLACKLIST.split(",")
    }
  },
  admins: process.env.DISCORD_SOUNDBOT_ADMINS,
  soundlist: process.env.DISCORD_SOUNDBOT_SOUNDLISTURL,
  paths: {
    sounds: "sounds"
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
