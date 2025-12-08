// gulpfile.js

const { src, dest, watch, series, parallel } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const terser = require("gulp-terser");
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();
const fileInclude = require("gulp-file-include");
const del = require("del");

const paths = {
  html: {
    src: "src/*.html",
    watch: "src/**/*.html",
    dest: "dist/",
  },
  styles: {
    src: "src/scss/main.scss",
    watch: "src/scss/**/*.scss",
    dest: "dist/css/",
  },
  scripts: {
    src: "src/js/**/*.js",
    dest: "dist/js/",
  },
  images: {
    src: "src/images/**/*.*",
    dest: "dist/images/",
  },
  fonts: {
    src: "src/fonts/**/*.*",
    dest: "dist/fonts/",
  },
};

// Очищення dist
function clean() {
  return del(["dist"]);
}

// HTML (за потреби можна включати частини через @@include)
function html() {
  return (
    src(paths.html.src)
      // Якщо захочеш використовувати інклуди:
      .pipe(
        fileInclude({
          prefix: "@@",
          basepath: "@file",
        })
      )
      .pipe(dest(paths.html.dest))
      .pipe(browserSync.stream())
  );
}

// SCSS -> CSS
function styles() {
  return src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        outputStyle: "expanded",
      }).on("error", sass.logError)
    )
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(cleanCSS({ level: 2 }))
    .pipe(sourcemaps.write("."))
    .pipe(dest(paths.styles.dest))
    .pipe(browserSync.stream());
}

// JS
function scripts() {
  return (
    src(paths.scripts.src)
      // Якщо потрібні сорсмапи для JS, розкоментуй:
      // .pipe(sourcemaps.init())
      .pipe(terser())
      // .pipe(sourcemaps.write('.'))
      .pipe(dest(paths.scripts.dest))
      .pipe(browserSync.stream())
  );
}

// Копіювання зображень
function images() {
  return src(paths.images.src).pipe(dest(paths.images.dest));
}

// Копіювання шрифтів
function fonts() {
  return src(paths.fonts.src).pipe(dest(paths.fonts.dest));
}

// Локальний сервер + watcher
function serve() {
  browserSync.init({
    server: {
      baseDir: "dist",
    },
    notify: false,
    open: false, // якщо хочеш, щоб браузер сам не відкривався
  });

  watch(paths.html.watch, html);
  watch(paths.styles.watch, styles);
  watch(paths.scripts.src, scripts);
  watch(paths.images.src, images);
  watch(paths.fonts.src, fonts);
}

const build = series(clean, parallel(html, styles, scripts, images, fonts));

exports.clean = clean;
exports.html = html;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.fonts = fonts;
exports.build = build;
exports.dev = series(build, serve);
exports.default = exports.dev;
