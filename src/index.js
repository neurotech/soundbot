const cpjax = require("cpjax");

let params = new URLSearchParams(document.location.search.substring(1));
let urlToken = params.get("token");
if (urlToken) {
  sessionStorage.setItem("discordToken", urlToken);
  window.history.replaceState({}, document.title, "/");
}

Vue.config.devtools = true;

var app = new Vue({
  el: "#app",
  data: {
    token: null,
    user: {},
    channels: {},
    queue: [
    ],
    state: {
      queue: 5,
      isRandomSoundSelected: false,
      noSoundSelected: true,
      selectedSound: {},
      selectedTextChannel: null,
      selectedVoiceChannel: null,
      libraryFilter: ""
    },
    library: [
    ]
  },
  computed: {
    filteredLibrary() {
      if (this.state.libraryFilter === "") return this.library;

      return this.library.filter(sound => {
        let id = sound.id.toLowerCase();
        let description = sound.description.toLowerCase();

        return (
          id.indexOf(this.state.libraryFilter.toLowerCase()) > -1 ||
          description.indexOf(this.state.libraryFilter.toLowerCase()) > -1
        );
      });
    },
    avatarImage() {
      if (this.user.id !== undefined)
        return {
          backgroundImage: `url(https://cdn.discordapp.com/avatars/${
            this.user.id
          }/${this.user.avatar}.png`
        };
    }
  },
  watch: {
    "state.queue": function(val, oldVal) {
      countItUp("queue-count", oldVal, val);
    }
  },
  created: function() {
    this.tokenCheck();
    this.getChannels();
  },

  methods: {
    resetState: function() {
      this.state.isRandomSoundSelected = false;
      this.state.noSoundSelected = true;
      this.state.selectedSound = {};
    },
    tokenCheck: function() {
      var tokenPresence = sessionStorage.getItem("discordToken");
      if (tokenPresence) {
        this.token = tokenPresence;
        this.getUserDetails(tokenPresence);
      }
    },
    getChannels: function() {
      var self = this;
      cpjax(
        {
          url: "/api/discord/channels",
          requestedWith: false
        },
        (err, data) => {
          let parsed = JSON.parse(data);
          self.channels = parsed;
          if (self.state.selectedVoiceChannel === null)
            self.state.selectedVoiceChannel = parsed.voice[0].id;

          if (self.state.selectedTextChannel === null)
            self.state.selectedTextChannel = parsed.text[0].id;
        }
      );
    },
    getUserDetails: function(discordToken) {
      var self = this;
      if (discordToken.length > 0) {
        cpjax(
          {
            url: "https://discordapp.com/api/users/@me",
            auth: `Bearer ${discordToken}`,
            requestedWith: false
          },
          (err, data) => {
            self.user = JSON.parse(data);
          }
        );
      }
    },
    logoutUser: function() {
      sessionStorage.removeItem("discordToken");
      window.location.replace("/auth/discord");
    }
  },
  mounted: function() {
    // this.updateData = setInterval(this.fetchData, 1000 * 60 * 2);
  },
  beforeDestroy: function() {
    // clearInterval(this.updateData);
  }
});

var countItUp = function(el, oldValue, newValue) {
  var counter = new CountUp(el, oldValue, newValue, 0, 2, {
    useEasing: true,
    useGrouping: true,
    separator: ",",
    decimal: "."
  });
  counter.start();
};
