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
    imagemin = require('gulp-imagemin')
;

var devApp    = 'dev/client/app/',
    devSass   = 'dev/client/scss/',
    devImg    = 'dev/client/img/',
    devClient = 'dev/client/',
    devServer = 'dev/server/',

    routes    = 'routes/',
    views     = 'views/',

    publicJs  = 'public/js/',
    publicCss = 'public/css/',
    publicImg = 'public/img/',
    Prod      = 'public/'
;

/* JS & TS */
var jsuglify = require('gulp-uglify');
var typescript = require('gulp-typescript');

// Other
var concat = require('gulp-concat');

var tsProject = typescript.createProject('tsconfig.json');

gulp.task('build-css', function () {
  return gulp.src(devSass+ '**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(postcss([precss, autoprefixer, cssnano]))
    .pipe(sourcemaps.write())
    .pipe(ext_replace('.css'))
    .pipe(gulp.dest(publicCss))
    .pipe(browserSync.stream());
});

gulp.task('build-ts', function () {
    return gulp.src(devApp + '**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(typescript(tsProject))
        .pipe(sourcemaps.write())
        // .pipe(jsuglify())
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest(publicJs));
});

gulp.task('build-img', function () {
  return gulp.src(devImg + '**/*')
    .pipe(imagemin({
      progressive: true
    }))
    .pipe(gulp.dest(publicImg));
});

gulp.task('build-html', function () {
  return gulp.src(devClient + '**/*.html')
    .pipe(gulp.dest(Prod + 'html/'));
});

gulp.task('watch:styles', function () {
  gulp.watch(devSass + '**/*.scss', ['build-css']);
});

gulp.task('watch', function () {
  gulp.watch(devApp + '**/*.ts', ['build-ts']);
  gulp.watch(devSass + '**/*.scss', ['build-css']);
  gulp.watch(devImg + '*', ['build-img']);
});

gulp.task('serve', function () {
  browserSync.init({
    /*port: 8080,
     server: {
     baseDir: "./"
     }*/
    proxy: 'http://192.168.101.8:3000',
    ui: {
      port: 3002
    }
  });

  gulp.watch([
    publicJs + '**/*.js',
    publicCss + '**/*.css',
    publicImg + '*',
    routes + '**/*.js',
    views + '**/*.hbs'
  ]).on('change', browserSync.reload);
});

gulp.task('default', ['watch', 'build-ts', 'build-css', 'serve']);