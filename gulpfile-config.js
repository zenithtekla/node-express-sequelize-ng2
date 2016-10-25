'use strict';
var appConfig = require('./app-config');

var gulpConfig = function(){
  var config = {
    server:           appConfig.site ,
    routes:           'routes/' ,
    views:            'views/' ,
    serverJSfiles: [
      'dev/server/**/*.js',
      'app*.js'
    ] ,
    browser_sync: {
      reload_delay: 500,
      watch: [
        'public/js/**/*.js' ,
        'public/css/**/*.css' ,
        'public/img/*' ,
        'routes/**/*.js' ,
        'views/**/*.hbs' ,
        'dev/server/*',
        'dev/client/**/*.html',
        'dev/_coffee/*.coffee'
      ],
      options: {
        /*port: 8080,
         server: {
         baseDir: "./"
         }*/
        // informs browser-sync to proxy our expressjs app which would run at the following location
        proxy: 'http://localhost:3000',

        // informs browser-sync to use the following port for the proxied app
        // notice that the default port is 3000, which would clash with our expressjs
        port: 4000,

        // open the proxied app in chrome
        // browser: ['google-chrome'],
        files: ["public/**/*.*"],
        ui: {
          port: 3002
        }
      }
    } ,
    src: {
      client:           'dev/client/' ,
      server:           'dev/server/' ,
      serverAppDir:     appConfig.serverAppDir,
      scss:             'dev/client/scss/**/*.scss' ,
      ts:               'dev/client/app/**/**/*.ts' ,
      img:              'dev/client/img/**/*' ,
      html:             'dev/client/**/*.html',
      coffee:           'dev/_coffee/'
    } ,
    public: {
      js:               'public/js/' ,
      css:              'public/css/' ,
      img:              'public/img/' ,
      lib:              'public/lib/' ,
      dir:              'public/',
      dist:             'public/dist/',
      html:             'public/html/'
    },
    dist: {
      coffee:           'bundle_cafe.js',
      js:               'bundle.js',
      min_js:           'bundle.min.js'
    },
    tests:              appConfig.serverApps.tests,
    test_interface:     'dev/test_interface/runner.html',
    test_site:          'http://localhost:3000/',
    lint: {
      scripts: ['**/*.js', '!node_modules/**']
    }
  };

  config.nodemonOptions = {
    script: config.server,
    delayTime: 50,
    env: {
      PORT: 3000
    },
    watch: config.serverJSfiles
  };

  return config;
};

module.exports = gulpConfig();