Vue.config.devtools = true;

var demo = new Vue({
  el: "#app",
  data: {
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

      return this.library.filter(
        sound =>
          sound.id.indexOf(this.state.libraryFilter) > 1 ||
          sound.description.indexOf(this.state.libraryFilter) > 1
      );
    }
  },
  watch: {
    // "path.to.thing": function (val, oldVal) {
    //   countItUp("ELEMENT", oldVal, val);
    // }
  },
  created: function() {
    // this.fetchData();
  },

  methods: {
    resetState: function() {
      this.state.isRandomSoundSelected = false;
      this.state.noSoundSelected = true;
      this.state.selectedSound = {};
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
