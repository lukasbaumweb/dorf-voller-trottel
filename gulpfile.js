const gulp = require("gulp"),
  sourcemaps = require("gulp-sourcemaps"),
  clean = require("gulp-clean"),
  babelify = require("babelify"),
  browserify = require("browserify"),
  source = require("vinyl-source-stream"),
  buffer = require("vinyl-buffer"),
  uglify = require("gulp-uglify"),
  watch = require("gulp-watch"),
  browserSync = require("browser-sync").create();

gulp.task("serve", () => {
  browserSync.init({
    open: false,
    server: {
      baseDir: "./dist",
    },
  });
});

gulp.task("clean", () => {
  return gulp.src("dist", { allowEmpty: true }).pipe(clean());
});

gulp.task("copy-assets", () =>
  gulp
    .src([
      "./assets/**/*.png",
      "./assets/**/*.xml",
      "./assets/**/*.svg",
      "./assets/**/*.ico",
      "./assets/**/*.webmanifest",
    ])
    .pipe(gulp.dest("dist/assets"))
);

gulp.task("copy-static-files", () =>
  gulp.src("src/*.html").pipe(gulp.dest("dist"))
);

gulp.task(
  "build",
  gulp.series("copy-assets", "copy-static-files", () => {
    return browserify({
      entries: ["./src/main.js"],
    })
      .transform(
        babelify.configure({
          presets: ["@babel/preset-env"],
        })
      )
      .bundle()
      .pipe(source("bundle.js"))
      .pipe(buffer())
      .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(sourcemaps.write("./maps"))
      .pipe(gulp.dest("./dist"));
  })
);

gulp.task("watch", () => {
  return gulp.watch("./src/**/*.js", gulp.series("build"));
});

gulp.task("default", gulp.parallel("serve", "watch"));
