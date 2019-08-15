const gulp = require("gulp");
const uglifycss = require("gulp-uglifycss");
const livereload = require("gulp-livereload");
const htmlmin = require("gulp-htmlmin");
const surge = require("gulp-surge");
const http = require("http");
const st = require("st");

// Task to minify HTML
// TODO: Minify HTML
gulp.task("html", function() {
  return (
    gulp
      .src("./src/*.html")
      .pipe(htmlmin({ collapseWhitespace: true }))
      .on("error", function(err) {
        console.log(err.toString());

        this.emit("end");
      })
      // .pipe(gulp.dest('./'))
      .pipe(livereload())
  );
});

// Task to minify CSS
gulp.task("css", function() {
  gulp
    .src("./assets/css/*.css")
    .pipe(
      uglifycss({
        uglyComments: true
      })
    )
    .on("error", function(err) {
      console.log(err.toString());

      this.emit("end");
    })
    .pipe(gulp.dest("build"))
    .pipe(livereload());
});

// Task to deploy to Surge
gulp.task("deploy", [], function() {
  return surge({
    project: "./", // Path to your static build directory
    domain: "boasbabs-airbnb-clone.surge.sh" // Your domain or Surge subdomain
  });
});

gulp.task("server", function(done) {
  http
    .createServer(
      st({ path: __dirname + "/src", index: "index.html", cache: false })
    )
    .listen(3000, done);
});

gulp.task("run", ["server", "css", "html"]);

gulp.task("watch", function() {
  // livereload.listen();
  gulp.watch("./src/*.html", ["html"]);
  gulp.watch("./assets/css/*.css", ["css"]);
});

gulp.task("default", ["run", "watch"]);
