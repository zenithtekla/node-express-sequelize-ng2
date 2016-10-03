var gulp = require('gulp'),

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

var assetsDev = 'assets/app/',
    assetsSass= 'assets/scss/',
    assetsImg = 'assets/img/',
    Dev       = 'assets/',

    publicJs  = 'public/js/',
    publicCss = 'public/css/',
    publicImg = 'public/img/',
    Prod      = 'public/';

/* JS & TS */
var jsuglify = require('gulp-uglify');
var typescript = require('gulp-typescript');

// Other
var concat = require('gulp-concat');

var tsProject = typescript.createProject('tsconfig.json');

gulp.task('build-css', function () {
  return gulp.src(assetsSass+ '**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(postcss([precss, autoprefixer, cssnano]))
    .pipe(sourcemaps.write())
    .pipe(ext_replace('.css'))
    .pipe(gulp.dest(publicCss));
});

gulp.task('build-ts', function () {
    return gulp.src(assetsDev + '**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(typescript(tsProject))
        .pipe(sourcemaps.write())
        // .pipe(jsuglify())
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest(publicJs));
});

gulp.task('build-img', function () {
  return gulp.src(assetsImg + '**/*')
    .pipe(imagemin({
      progressive: true
    }))
    .pipe(gulp.dest(publicImg));
});

gulp.task('build-html', function () {
  return gulp.src(Dev + '**/*.html')
    .pipe(gulp.dest(Prod + 'html/'));
});

gulp.task('watch:styles', function () {
  gulp.watch(assetsSass + '**/*.scss', ['build-css']);
});

gulp.task('watch', function () {
  gulp.watch(assetsDev + '**/*.ts', ['build-ts']);
  gulp.watch(assetsSass + '**/*.scss', ['build-css']);
  gulp.watch(assetsImg + '*', ['build-img']);
});

gulp.task('default', ['watch', 'build-ts', 'build-css']);