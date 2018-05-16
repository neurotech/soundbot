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
    token: "",
    user: {},
    state: {
      isRandomSoundSelected: false,
      noSoundSelected: true,
      selectedSound: {},
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
    // "path.to.thing": function (val, oldVal) {
    //   countItUp("ELEMENT", oldVal, val);
    // }
  },
  created: function() {
    // this.fetchData();
    this.tokenCheck();
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
    getUserDetails: function(discordToken) {
      var self = this;
      if (discordToken.length > 0) {
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function() {
          if (this.readyState === 4) {
            self.user = JSON.parse(this.responseText);
          }
        });

        xhr.open("GET", "https://discordapp.com/api/users/@me");
        xhr.setRequestHeader("Authorization", "Bearer " + discordToken);

        xhr.send();
      }
    }

    // fetchData: function() {
    //   var request = new XMLHttpRequest();
    //   var self = this;
    //   request.open("GET", url, true);
    //   request.onreadystatechange = function() {
    //     if (request.readyState === 4) {
    //       if (request.status === 200) {
    //         var response = JSON.parse(request.responseText);
    //         self.data = response.data;
    //       } else {
    //       }
    //     }
    //   };
    //   request.send(null);
    // }
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
