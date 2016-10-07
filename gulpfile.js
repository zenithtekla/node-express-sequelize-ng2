var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),

    /* CSS */
    postcss = require('gulp-postcss'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('autoprefixer'),
    precss = require('precss'),
    cssnano = require('cssnano'),
    minify  = require('gulp-minify-css'),

    /* Mixed */
    ext_replace = require('gulp-ext-replace'),

    /* Images */
    imagemin = require('gulp-imagemin'),

    /* Server */
    nodemon = require('gulp-nodemon'),
    config = require('./gulpfile-config'),

    /* Test tool */
    mochaPhantomJS = require('gulp-mocha-phantomjs'),
    /* QA tool */
    jshint = require('gulp-jshint')
;

/* JS & TS */
var uglify = require('gulp-uglify'),
    rename   = require('gulp-rename');
var typescript = require('gulp-typescript');

// Other
var concat = require('gulp-concat'),
    es = require('event-stream');

// Coffee
var coffee = require('gulp-coffee');

var tsProject = typescript.createProject('tsconfig.json');

gulp.task('build-css', function () {
  return gulp.src(config.src.scss)
    .pipe(sourcemaps.init())
    .pipe(postcss([precss, autoprefixer, cssnano]))
    .pipe(sourcemaps.write())
    .pipe(ext_replace('.css'))
    .pipe(gulp.dest(config.public.css));
});

// separate task to build JS from TS files
gulp.task('build-ts', function () {
    return gulp.src(config.src.ts)
      .pipe(sourcemaps.init())
      .pipe(typescript(tsProject))
      .pipe(sourcemaps.write())
      // .pipe(jsuglify())
      .pipe(concat(config.dist.js))
      .pipe(gulp.dest(config.public.js));
});

// separate task to build JS from CS files
gulp.task('build-coffee', function () {
   return gulp.src(config.src.coffee + '**/*.coffee')
     .pipe(coffee())
     .pipe(concat(config.dist.coffee))
     .pipe(gulp.dest(config.src.coffee));
});

// A combined task to build JS from both TypeScript and CoffeeScript sources and merge them together
gulp.task('merge-ts-coffee', function () {
  var jsfromCoffeeScript = gulp.src(config.src.coffee + '**/*.coffee')
    .pipe(coffee());
  var jsfromTS = gulp.src(config.src.ts)
    .pipe(sourcemaps.init())
    .pipe(typescript(tsProject))
    .pipe(sourcemaps.write());

   return es.merge(jsfromCoffeeScript, jsfromTS)
     .pipe(concat(config.dist.js))
     .pipe(gulp.dest(config.public.js));
});

gulp.task('uglify', function () {
   return gulp.src(config.public.js+config.dist.js, {base: "./"})
     .pipe(uglify())
     .pipe(rename({ suffix: '.min' }))
     .pipe(gulp.dest("./"));
}); // This task will create bundle.min.js in the same public/js folder

gulp.task('uglify-all', function () {
  var uglifyCSS = gulp.src(config.public.css+ '*.css')
    .pipe(concat('bundle.min.css'))
    .pipe(minify());
  var uglifyJS = gulp.src(config.public.js+config.dist.js)
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }));

  return es.merge(uglifyCSS,uglifyJS)
    .pipe(gulp.dest(config.public.dist));
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
  return gulp.watch(config.src.scss, ['build-css']);
});

gulp.task('watch', function () {
  gulp.watch(config.src.ts, ['merge-ts-coffee']); // ['build-ts', 'test']
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

/* TESTING & QA TOOLS */

/*gulp.task('mocha-test', function () {
 gulp.src('./dev/server/app/tests/general_testing')
 .pipe(mocha())
 .on('error', function (err) {
 this.emit('end');
 });
 });*/

gulp.task('jshint', function () {
  return gulp
    .src(config.lint.scripts)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

// works fine: $ PORT=3008 gulp test
// gulp.task('test', ['jshint'], function () {
gulp.task('test', function () {
  return gulp
    .src(config.test_interface)
    .pipe(mochaPhantomJS({reporter: 'spec'}));
});

gulp.task('test-site', function () {
  var stream = mochaPhantomJS();
  stream.write({path: config.test_site});
  stream.end();
  return stream;
});

gulp.task('build', ['merge-ts-coffee', 'uglify-all']);

gulp.task('serve', ['browser-sync', 'merge-ts-coffee', 'watch']);

gulp.task('default', ['serve']);