'use strict';
var appConfig = require('./app-config');

var gulpConfig = function(){
  var config = {
    clientDir:            appConfig.clientDir,
    dist:                 appConfig.dist,
    lib:                  appConfig.lib,

    scripts: {
      src: [
                  './dev/client/app/**/*.+(ts|js)'
      ],
      watch:    [
                  './dev/client/app/**/*.+(ts|js)',
                  './dev/_coffee/**/*.coffee'
      ]
    },

    coffee: {
      src:        './dev/_coffee/**/*.coffee',
      output:     'bundle_cafe.js',
      dest:       appConfig.dist
    },

    styles: {
      src: {
        scss: [
                  './dev/client/assets/**/*.+(css|scss)',
                  '!./dev/client/assets/styles{,.min}.+(css|scss)'
        ],
        bundle: [
/*                './public/lib/bootstrap/dist/css/bootstrap.css',
                  './public/lib/font-awesome/css/font-awesome.css',*/
                  './public/dist/assets/**/*.css',
                  '!./public/dist/assets/styles{,.min}.css'
        ]
      },
      output:     'styles.css',
      dest:       './public/dist/assets/'
    },

    images: {
      src: [
                  'dev/client/images/**/*.+(png|img|bmp|jpg|jpeg|gif|ico|tff|tiff)'
      ],
      dest:       './public/dist/images/'
    },

    html: {
      src:        './dev/client/app/**/*.html',
      dest:       appConfig.dist
    },

    fonts: {
      src: ['./public/lib/font-awesome/fonts/**/*'],
      dest:'./public/dist/fonts/'
    },

    // server:site, the www for nodeMon configuration
    site:               './bin/www' ,
    serverAppDir:       appConfig.serverAppDir,

    // server js files for nodemon
    serverJSfiles: [
          'dev/server/**/*.js',
          'app*.js'
    ],
    browser_sync: {
      reload_delay: 500,
      watch: [
          './public/dist/**/*.{img,png,jpg,jpeg,gif,ico,bmp}',
          './public/dist/*.bundle.js',
          './public/dist/assets/styles.css',
          './dev/server/*',
          './dev/client/**/*.{html,htm}'
          // './dev/_coffee/*.coffee'
      ],
      options: {
        /*port: 8080,
         server: {
         baseDir: "./"
         }*/
        // informs browser-sync to proxy our expressjs app which would run at the following location
        proxy:  'http://localhost:3000',

        // informs browser-sync to use the following port for the proxied app
        // notice that the default port is 3000, which would clash with our expressjs
        port:   4000,

        // open the proxied app in chrome
        // browser: ['google-chrome'],
        files:  ["public/**/*.*"],
        ui: {
          port: 3002
        }
      }
    },
    tests:              appConfig.serverApps.tests,
    test_interface:     'dev/test_interface/runner.html',
    test_site:          'http://localhost:3000/',
    lint: {
      scripts: ['**/*.js', '!node_modules/**', '!public/**']
    }
  };

  config.nodemonOptions = {
    script: config.site,
    delayTime: 50,
    env: {
      PORT: 3000
    },
    // socket may be optional
    socket: {
      domain: 'localhost:3000'
    },
    watch: config.serverJSfiles
  };

  return config;
};

module.exports = gulpConfig();