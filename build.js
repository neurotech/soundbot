const fs = require("fs");
const mkdirp = require("mkdirp");
const pug = require("pug");
const sass = require("node-sass");
const browserify = require("browserify");
const log = require("./log");

let buildDir = "./build";
let fontsDir = "./build/fonts/feather";

// Prepare the ./build directory and subdirectories
if (!fs.existsSync(buildDir)) fs.mkdirSync(buildDir);
if (!fs.existsSync(fontsDir)) mkdirp.sync(fontsDir);

// Compile pug to HTML
fs.writeFileSync(
  "./build/index.html",
  pug.renderFile("./src/index.pug"),
  "utf8"
);
log("success", "Compiled pug to HTML.");

// Compile Sass to CSS
sass.render(
  {
    file: "./src/index.scss",
    outputStyle: "compressed"
  },
  function(err, result) {
    if (err) console.error(err);
    fs.writeFileSync("./build/index.css", result.css.toString(), "utf8");
  }
);
log("success", "Compiled Sass to CSS.");

// Browserify + Uglifyify JS
let bundler = browserify(__dirname + "/src/index.js");
bundler.transform("uglifyify", { global: true });
bundler.bundle().pipe(fs.createWriteStream(__dirname + "/build/index.js"));
log("success", "Uglified JS.");

// Vendor CSS, JS
fs
  .createReadStream("./node_modules/tabler-ui/dist/assets/css/dashboard.css")
  .pipe(fs.createWriteStream("./build/dashboard.css"));
fs
  .createReadStream("./node_modules/modern-normalize/modern-normalize.css")
  .pipe(fs.createWriteStream("./build/normalise.css"));
fs
  .createReadStream("./node_modules/vue/dist/vue.min.js")
  .pipe(fs.createWriteStream("./build/vue.min.js"));
fs
  .createReadStream("./node_modules/countup.js/dist/countUp.min.js")
  .pipe(fs.createWriteStream("./build/countUp.min.js"));
fs
  .createReadStream("./node_modules/socket.io-client/dist/socket.io.js")
  .pipe(fs.createWriteStream("./build/socket.io.js"));
log("success", "Built vendor CSS and JS.");

// Fonts
fs
  .createReadStream(
    "./node_modules/tabler-ui/dist/assets/fonts/feather/feather-webfont.woff"
  )
  .pipe(fs.createWriteStream("./build/fonts/feather/feather-webfont.woff"));
log("success", "Built vendor fonts.");

console.log("\n");
