var demo = new Vue({
  el: "#app",
  data: {},
  computed: {},
  watch: {
    // "path.to.thing": function (val, oldVal) {
    //   countItUp("ELEMENT", oldVal, val);
    // }
  },
  created: function() {
    // this.fetchData();
  },

  methods: {
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
