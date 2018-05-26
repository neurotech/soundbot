const params = new URLSearchParams(document.location.search.substring(1));
const urlToken = params.get("token");
if (urlToken) {
  sessionStorage.setItem("discordToken", urlToken);
  window.history.replaceState({}, document.title, "/");
}

const authState = sessionStorage.getItem("discordToken");
if (!authState) {
  window.location.replace("/login");
} else {
  const cpjax = require("cpjax");

  // socket.io
  const socket = io({ query: { token: authState } });

  // Data
  socket.on("queue:populate", function(queue) {
    if (queue.length > 0) {
      app.queue = queue;
      app.state.queue = queue.length;
      console.log(`🤖 -- Queue populated with ${queue.length} item(s).`);
    }
  });
  socket.on("library:populate", function(sounds) {
    if (sounds.length > 0) {
      app.library = sounds;
      console.log(
        `🤖 -- Sound library populated with ${sounds.length} sounds(s).`
      );
    }
  });
  socket.on("queue:add-item", function(item) {
    app.queue.push(item);
  });
  socket.on("queue:remove-item", function(item) {
    let itemLocation = app.queue
      .map(function(e) {
        return e.queueId;
      })
      .indexOf(item.queueId);

    app.queue.splice(itemLocation, 1);
  });

  // State
  socket.on("connect", function() {
    app.state.socket = "connected";
  });
  socket.on("connect_error", function() {
    app.state.socket = "disconnected";
  });
  socket.on("reconnect_error", function() {
    app.state.socket = "disconnected";
  });
  socket.on("reconnect_failed", function() {
    app.state.socket = "disconnected";
  });
  socket.on("reconnect_attempt", function() {
    app.state.socket = "connecting";
    socket.io.opts.query = {
      token: authState
    };
  });

  Vue.config.devtools = true;

  var app = new Vue({
    el: "#app",
    data: {
      token: null,
      user: {},
      channels: {},
      state: {
        queue: 0,
        socket: "disconnected",
        isRandomSoundSelected: false,
        noSoundSelected: true,
        selectedSound: {},
        selectedTextChannel: null,
        selectedVoiceChannel: null,
        libraryFilter: "",
        errorMessage: {
          status: null,
          result: null
        }
      },
      socket: {
        error: false
      },
      queue: [],
      library: []
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
      },
      queue: function(val, oldVal) {
        this.state.queue = val.length;
      }
    },
    created: function() {
      this.tokenCheck();
    },

    methods: {
      errorHandler: function(error) {
        let parsed = JSON.parse(error.message);
        this.state.errorMessage.status = parsed.status || "Error";
        this.state.errorMessage.result = parsed.result || "An error occurred.";
      },
      clearErrorMessage: function() {
        this.state.errorMessage = { status: null, result: null };
      },
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
            auth: `${self.user.username}#${self.user.discriminator}|${
              self.token
            }`,
            requestedWith: false
          },
          (err, data) => {
            if (err) return self.errorHandler(err);

            let parsed = JSON.parse(data);
            self.channels = parsed;
            if (self.state.selectedVoiceChannel === null)
              self.state.selectedVoiceChannel = parsed.voice[0].id;

            if (self.state.selectedTextChannel === null)
              self.state.selectedTextChannel = parsed.text[0].id;
          }
        );
      },
      getLibrary: function() {
        var self = this;
        cpjax(
          {
            url: "/api/sounds/list",
            auth: `${self.user.username}#${self.user.discriminator}|${
              self.token
            }`,
            requestedWith: false
          },
          (err, data) => {
            if (err) return self.errorHandler(err);
            let parsed = JSON.parse(data);
            self.library = parsed;
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
              if (err) return self.errorHandler(err);
              self.user = JSON.parse(data);
              this.getChannels();
              this.getLibrary();
            }
          );
        }
      },
      logoutUser: function() {
        sessionStorage.removeItem("discordToken");
        window.location.replace("/auth/discord");
      },
      playRandomSound: function() {
        var self = this;
        var channel = this.state.selectedVoiceChannel;
        var author = this.user.username;
        cpjax(
          {
            method: "POST",
            url: `/command/randomsound/${channel}`,
            auth: `${self.user.username}#${self.user.discriminator}|${
              self.token
            }`,
            data: JSON.stringify(author)
          },
          (err, data) => {
            if (err) return self.errorHandler(err);
          }
        );
      },
      playSound: function() {
        var self = this;
        var selectedSound = this.state.selectedSound;
        selectedSound.author = this.user.username;
        var channel = this.state.selectedVoiceChannel;
        cpjax(
          {
            method: "POST",
            url: `/command/playsound/${channel}`,
            auth: `${self.user.username}#${self.user.discriminator}|${
              self.token
            }`,
            data: JSON.stringify(selectedSound)
          },
          (err, data) => {
            if (err) return self.errorHandler(err);
          }
        );
      },
      textSentence: function() {
        var self = this;
        var channel = this.state.selectedTextChannel;
        var author = this.user.username;
        cpjax(
          {
            method: "POST",
            url: `/command/sentence/${channel}`,
            auth: `${self.user.username}#${self.user.discriminator}|${
              self.token
            }`,
            data: author
          },
          (err, data) => {
            if (err) return self.errorHandler(err);
          }
        );
      },
      ttsSentence: function() {
        var self = this;
        var channel = this.state.selectedTextChannel;
        var author = this.user.username;
        cpjax(
          {
            method: "POST",
            url: `/command/tts-sentence/${channel}`,
            auth: `${self.user.username}#${self.user.discriminator}|${
              self.token
            }`,
            data: author
          },
          (err, data) => {
            if (err) return self.errorHandler(err);
          }
        );
      },
      refreshCooldowns: function() {
        var self = this;
        // Make a smaller array that just contains elements
        // that have timeLeft > 0
        // then remove if (element && element.timeLeft <= 60)
        // etc
        self.library.forEach((element, index) => {
          if (element && element.timeLeft <= 60) {
            // https://stackoverflow.com/a/15437397
            let now = new Date();
            let lastPlayed = new Date(element.lastPlayed);
            let diff = now.getTime() - lastPlayed.getTime();
            let seconds = Math.round(diff * 0.001);
            let remain = 60 - seconds;

            self.$set(this.library, index, {
              id: element.id,
              file: element.file,
              description: element.description,
              lastPlayed: element.lastPlayed,
              timeLeft: remain > 0 ? remain : 0
            });
          }
        });
      }
    },
    mounted: function() {
      this.updateLibrary = setInterval(this.getLibrary, 1000 * 60 * 10);
      this.updateChannels = setInterval(this.getChannels, 1000 * 60 * 10);
      this.updateCooldowns = setInterval(this.refreshCooldowns, 1000 * 3);
    },
    beforeDestroy: function() {
      clearInterval(this.updateLibrary);
      clearInterval(this.updateChannels);
      clearInterval(this.updateCooldowns);
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
}
