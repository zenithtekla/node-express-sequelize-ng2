var gulp                = require('gulp'),
    config              = require('./gulpfile-config'),

    /*-- CSS --*/
    sass                = require('gulp-sass'),
    postcss             = require('gulp-postcss'),
    autoprefixer        = require('autoprefixer'),
    precss              = require('precss'),
    cssnano             = require('cssnano'),
    minify              = require('gulp-minify-css'),

    /*-- Mixed --*/
    _                   = require('lodash'),
    sourcemaps          = require('gulp-sourcemaps'),
    ext_replace         = require('gulp-ext-replace'),
    concat              = require('gulp-concat'),
    es                  = require('event-stream'),
    browserSync         = require('browser-sync').create(),
    runSequence         = require('run-sequence'),
    shell               = require('gulp-shell'),
    // sanity
    clean               = require('gulp-clean'),
    // dependencies management
    bower               = require('gulp-bower'),

    /*-- Images --*/
    imagemin            = require('gulp-imagemin'),

    /*-- Server --*/
    nodemon             = require('gulp-nodemon'),


    /*-- Test tool --*/
    mocha               = require('gulp-mocha'),
    mochaPhantomJS      = require('gulp-mocha-phantomjs'),

    /*-- QA tool --*/
    jshint              = require('gulp-jshint'),

    /*-- JS & TS --*/
    uglify              = require('gulp-uglify'),
    rename              = require('gulp-rename'),

    typescript          = require('gulp-typescript'),
    tsProject           = typescript.createProject('tsconfig.json'),

    /*-- Coffee --*/
    coffee              = require('gulp-coffee'),

    /*-- Bundling --*/
    htmlreplace         = require('gulp-html-replace'),

    moment              = require('moment'),

    bundleHash          = moment(new Date().getTime()).format('YYYY-MM-DD-HH-mm-ss'),
    mainBundleName      = bundleHash + '.main.bundle.js',
    mainShortName       = 'main.bundle.js',
    vendorBundleName    = bundleHash + '.vendor.bundle.js',
    vendorShortName     = 'vendor.bundle.js',
    mainStylesBundleName= bundleHash + '.styles.min.css'
;



// Set NODE_ENV to 'test'
gulp.task('env:test', function () {
  process.env.NODE_ENV = 'test';
});

// Set NODE_ENV to 'development'
gulp.task('env:dev', function () {
  process.env.NODE_ENV = 'development';
});

// Set NODE_ENV to 'production'
gulp.task('env:prod', function () {
  process.env.NODE_ENV = 'production';
});

var tasks = {
  bundle_css: {
    dev:                () => gulp.src(config.styles.src.bundle)
      .pipe(concat(config.styles.output))
      .pipe(gulp.dest(config.styles.dest)),
    dist:               () => gulp.src(config.styles.src.bundle)
      .pipe(concat(mainStylesBundleName))
      .pipe(minify())
      .pipe(gulp.dest(config.styles.dest))
  },
  bundle_vendor: {
    dev:                (vendor) => vendor.pipe(concat(vendorShortName))
      .pipe(gulp.dest(config.dist)),
    dist:               (vendor) => vendor
      .pipe(sourcemaps.init())
      .pipe(concat(vendorBundleName))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(config.dist))
  },
  bundle_app: {
    dev:                (app) =>  app.pipe(concat(mainShortName))
      .pipe(gulp.dest(config.dist)),
    dist:               (app) =>  app.pipe(sourcemaps.init())
      .pipe(concat(mainBundleName))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(config.dist))
  },
  build_css:            function(src, srcmaps, dest){
    srcmaps = srcmaps || null;
    return gulp.src(src)
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(postcss([precss, autoprefixer, cssnano]))
      .pipe(sourcemaps.write(srcmaps))
      .pipe(ext_replace('.css'))
      .pipe(gulp.dest(dest));
  },
  build_ts:             function(src, tsconfig, srcmaps, output, dest) {
    srcmaps = srcmaps || null;
    return gulp.src(src)
      .pipe(sourcemaps.init())
      .pipe(typescript(tsconfig))
      .pipe(sourcemaps.write(srcmaps))
      // .pipe(jsuglify())
      .pipe(concat(output))
      .pipe(gulp.dest(dest))
  },
  build_coffee:         function (src, output, dest) {
    return gulp.src(src)
      .pipe(coffee())
      .pipe(concat(output))
      .pipe(gulp.dest(dest));
  },
  merge_ts_coffee:      function (src, tsconfig, srcmaps, output, dest) {
    srcmaps = srcmaps || null;

    var jsfromCoffeeScript = gulp.src(src.coffee).pipe(coffee()),

        jsfromTS = gulp.src(src.scripts)
                    .pipe(sourcemaps.init())
                    .pipe(typescript(tsconfig))
                    .pipe(sourcemaps.write())
    ;

    return es.merge(jsfromCoffeeScript, jsfromTS)
      .pipe(concat(output))
      .pipe(gulp.dest(dest));
  },
  copy_js:            function (src, options, suffix, dest) {
    options = options || {};
    suffix  = suffix  || {};

    return gulp.src(src, options)
      .pipe(rename(suffix))
      .pipe(gulp.dest(dest));
  },
  uglify_js:            function (src, options, suffix, dest) {
    options = options || {};
    suffix  = suffix  || {};

    return gulp.src(src, options)
      .pipe(uglify())
      .pipe(rename(suffix))
      .pipe(gulp.dest(dest));
  },
  uglify_css:           function (src, output, dest) {
    return uglifyCSS = gulp.src(src)
      .pipe(concat(output))
      .pipe(minify())
      .pipe(gulp.dest(dest));
  },
  uglify_both:          function (src, options, suffix, output, dest) {
    options = options || {};
    suffix  = suffix  || {};
    var uglifyJS = gulp.src(src.js, options)
      .pipe(uglify())
      .pipe(rename(suffix));

    var uglifyCSS = gulp.src(src.css)
      .pipe(concat(output))
      .pipe(minify());


    return es.merge(uglifyJS, uglifyCSS)
      .pipe(gulp.dest(dest));
  }
};

gulp.task('dist', ['build']);
gulp.task('build', function(callback){
  runSequence('clean', 'copy_images', 'copy_fonts', 'copy_html', 'build:css', 'bundle', 'uglify_all', callback);
});


gulp.task('build:watch', ['watch', 'uglify_all']);

gulp.task('test', ['test:server']);

// gulp.task('serve', ['build:css', 'bundle:css:dev', 'merge_ts_coffee', 'browser_sync', 'watch']);
gulp.task('serve', function(callback){
  runSequence('clean:dev', 'copy_images', 'copy_fonts', 'build:css', 'bundle:css:dev', 'bundle:vendor:dev', 'merge_ts_coffee', 'browser_sync', 'watch', callback);
});

gulp.task('serve:dev', function(callback){
  runSequence('browser_sync', 'watch', callback);
});

gulp.task('dev', ['serve']);
gulp.task('default', ['serve']);

gulp.task('bundle:vendor', ['bundle:vendor:dev', 'bundle:vendor:dist']);

gulp.task('bundle:vendor:dev', function () {
  var vendor = gulp.src(config.vendor.js);
  return tasks.bundle_vendor.dev(vendor);
});
gulp.task('bundle:vendor:dist', function () {
  var vendor = gulp.src(config.vendor.js);
  return tasks.bundle_vendor.dist(vendor);
});

gulp.task('build:css', function () {
  return tasks.build_css(config.styles.src.scss, null, config.styles.dest);
});

gulp.task('bundle', ['bundle:vendor', 'bundle:css', 'merge_ts_coffee'], function () {
  return gulp.src('dev/server/views/index.hbs')
    .pipe(htmlreplace({
      'base': '',
      'app': mainBundleName,
      'vendor': vendorBundleName,
      'css': 'assets/' + mainStylesBundleName
    }))
    .pipe(ext_replace('.html'))
    .pipe(gulp.dest(config.dist));
});

gulp.task('bundle:css', ['build:css'], function() {
  tasks.bundle_css.dev();
  return tasks.bundle_css.dist();
});

gulp.task('bundle:css:dev', ['build:css'], function() {
  return tasks.bundle_css.dev();
});
gulp.task('bundle:css:dist', ['build:css'], function() {
  return tasks.bundle_css.dist();
});


// separate task to build JS from TS files
gulp.task('build:ts', function () {
  return tasks.build_ts(config.scripts.src,tsProject, null, mainShortName, config.dist);
});

// separate task to build JS from CS files
gulp.task('build:coffee', function () {
  return tasks.build_coffee(config.coffee.src, config.coffee.output, config.coffee.dest);
});

// A combined task to build JS from both TypeScript and CoffeeScript sources and merge them together
// bundle:app
gulp.task('merge_ts_coffee', function () {
  var src = {
    coffee: config.coffee.src,
    scripts: config.scripts.src
  };

  return tasks.merge_ts_coffee(src, tsProject, null, mainShortName, config.dist);
});

gulp.task('copy_js', function () {
  return tasks.copy_js(config.dist+mainShortName, {base: "./"}, { prefix: bundleHash + '.' }, './');
}); // This task will create main.bundle.min.js in the same public/js folder

gulp.task('uglify_js', function () {
  return tasks.uglify_js(config.dist+mainShortName, {base: "./"}, { prefix: bundleHash + '.' }, './');
}); // This task will create main.bundle.min.js in the same public/js folder

gulp.task('uglify_css', function () {
  return tasks.uglify_css(config.styles.dest + config.styles.output, 'styles.min.css', config.styles.dest);
});

gulp.task('uglify_all', ['copy_js', 'uglify_css']); // just copy_js cuz uglify_js cripples main.bundle.js

/*-- COPY --*/
gulp.task('copy_fonts', function(){
  return gulp.src(config.fonts.src)
    .pipe(gulp.dest(config.fonts.dest));
});

gulp.task('copy_images', function () {
  return gulp.src(config.images.src, { base: config.clientDir+'/images'})
    .pipe(imagemin({
      progressive: true
      // use: [pngquant()] ; with pngquant = require('imagemin-pngquant')
    }))
    .pipe(gulp.dest(config.images.dest));
});

gulp.task('copy_html', function () {
  return gulp.src(config.html.src, {base: config.clientDir})
    .pipe(gulp.dest(config.html.dest));
});


/*-- WATCHERS --*/
gulp.task('watch:styles', function () {
  return gulp.watch(config.styles.src.scss, ['bundle:css:dev']);
});

gulp.task('watch:html', function () {
  return gulp.watch(config.html.src);
});

/*gulp.task('watch:vendors', function () {
  return gulp.watch(config.vendor.watch, ['bundle:vendor:dev']);
});*/

gulp.task('watch:scripts', function () {
  return gulp.watch(config.scripts.watch, ['merge_ts_coffee']);
});

gulp.task('watch:images', function () {
  return gulp.watch(config.images.src, ['copy_images']);
});

gulp.task('watch', ['watch:images', 'watch:html', 'watch:styles' /*, 'watch:vendors'*/, 'watch:scripts']);

/*-- DEV --*/
gulp.task('browser_sync', ['nodemon'], function () {
  browserSync.init(config.browser_sync.options);

  gulp.watch(config.browser_sync.watch).on('change', browserSync.reload);
});

gulp.task('nodemon', function (cb) {
  var started = false;
  // Start the server at the beginning of the task
  return nodemon(config.nodemonOptions)
    .on('start', function () {
      if (!started) {
        started = true;
        cb();        
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
gulp.task('test-interface', function () {
  return gulp
    .src(config.test_interface)
    .pipe(mochaPhantomJS({reporter: 'spec'}));
});

gulp.task('test:server', ['env:test'], function () {
  return gulp
    // .src('./dev/server/app/tests/')
    // .src(config.server)
    .src(config.serverAppDir + '/tests/')
    .pipe(mocha({reporter: 'spec'}));
});

gulp.task('test-site', function () {
  var stream = mochaPhantomJS();
  stream.write({path: config.test_site});
  stream.end();
  return stream;
});

gulp.task("angular2:moveLibs", function () {
  return gulp.src([
      "node_modules/@angular/common/**/*",
      "node_modules/@angular/compiler/**/*",
      "node_modules/@angular/core/**/*",
      "node_modules/@angular/http/**/*",
      "node_modules/@angular/platform-browser/**/*",
      "node_modules/@angular/platform-browser-dynamic/**/*",
      "node_modules/@angular/router/**/*",
      "node_modules/@angular/router-deprecated/**/*",
      "node_modules/@angular/upgrade/**/*",
      "node_modules/systemjs/dist/system.src.js",
      "node_modules/systemjs/dist/system-polyfills.js",
      "node_modules/rxjs/**/*",
      "node_modules/core-js/**/*",
      "node_modules/zone.js/dist/zone.js",
      "node_modules/reflect-metadata/Reflect.js",
      "node_modules/reflect-metadata/Reflect.js.map"
    ],
    { base: "node_modules" })
    .pipe(gulp.dest(config.lib));
});

/*-- CLEANERS --*/
gulp.task('clean', ['clean:dist']);

gulp.task('clean:dist', function () {
  return gulp.src([config.dist], {read: false})
    .pipe(clean());
});

gulp.task('clean:styles', function () {
  return gulp.src([
    config.styles.dest +'styles.css'
  ], {read: false})
    .pipe(clean());
});

gulp.task('clean:vendor', function () {
  return gulp.src([
    config.scripts.dest + vendorShortName
  ], {read: false})
    .pipe(clean());
});

gulp.task('clean:scripts', function () {
  return gulp.src([
    config.scripts.dest + mainShortName
  ], {read: false})
    .pipe(clean());
});

gulp.task('clean:client', function(){
   return gulp.src([
     './dev/client/app/**/*.js{,.map}',
     '!./dev/client/app/vendor.js'
   ], {read: false})
     .pipe(clean());
});

gulp.task('clean:dev', ['clean:styles', 'clean:vendor', 'clean:scripts']);