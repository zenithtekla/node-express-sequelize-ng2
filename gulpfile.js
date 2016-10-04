var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),

    /* CSS */
    postcss = require('gulp-postcss'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('autoprefixer'),
    precss = require('precss'),
    cssnano = require('cssnano'),

    /* Mixed */
    ext_replace = require('gulp-ext-replace'),

    /* Images */
    imagemin = require('gulp-imagemin'),

    /* Server */
    nodemon = require('gulp-nodemon'),
    config = require('./gulpfile-config')()
;

/* JS & TS */
var jsuglify = require('gulp-uglify');
var typescript = require('gulp-typescript');

// Other
var concat = require('gulp-concat');

var tsProject = typescript.createProject('tsconfig.json');

gulp.task('build-css', function () {
  return gulp.src(config.src.scss)
    .pipe(sourcemaps.init())
    .pipe(postcss([precss, autoprefixer, cssnano]))
    .pipe(sourcemaps.write())
    .pipe(ext_replace('.css'))
    .pipe(gulp.dest(config.public.css));
});

gulp.task('build-ts', function () {
    return gulp.src(config.src.ts)
        .pipe(sourcemaps.init())
        .pipe(typescript(tsProject))
        .pipe(sourcemaps.write())
        // .pipe(jsuglify())
        .pipe(concat(config.dist.js))
        .pipe(gulp.dest(config.public.js));
});

gulp.task('build-img', function () {
  return gulp.src(config.src.img)
    .pipe(imagemin({
      progressive: true
    }))
    .pipe(gulp.dest(config.public.img));
});

gulp.task('build-html', function () {
  return gulp.src(config.src.html)
    .pipe(gulp.dest(config.public.html));
});

gulp.task('watch:styles', function () {
  gulp.watch(config.src.scss, ['build-css']);
});

gulp.task('watch', function () {
  gulp.watch(config.src.ts, ['build-ts']);
  gulp.watch(config.src.scss, ['build-css']);
  gulp.watch(config.src.img, ['build-img']);
});

gulp.task('browser-sync', ['nodemon'], function () {
  browserSync.init(config.browser_sync.options);

  gulp.watch(config.browser_sync.watch).on('change', browserSync.reload);
});

gulp.task('nodemon', function (cb) {
  var started = false;
  // Start the server at the beginning of the task
  return nodemon(config.nodemonOptions)
    .on('start', function () {
      if (!started) {
        cb();
        started = true;
      }
      // console.log('Restarting server ...');
    })
    .on('restart', function () {
      // reload connected browsers after a slight delay
      setTimeout(function reload() {
        browserSync.reload({
          stream: false
        });
      }, config.browser_sync.reload_delay);
    }).on('crash', function() {
      console.error('Application has crashed!\n');
      stream.emit('restart', 10);  // restart the server in 10 seconds
    });
});

gulp.task('serve', ['browser-sync', 'watch']);

gulp.task('default', ['serve']);