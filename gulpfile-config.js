module.exports = function(){
  var config = {
    server: './bin/www' ,
    routes: 'routes/' ,
    views: 'views/' ,
    serverJSfiles: [
      'routes/**/*.js' ,
      'dev/server/**/*.js'
    ] ,
    browser_sync: {
      reload_delay: 500,
      watch: [
        'public/js/**/*.js' ,
        'public/css/**/*.css' ,
        'public/img/*' ,
        'routes/**/*.js' ,
        'views/**/*.hbs' ,
        'dev/server/*'
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
      client: 'dev/client/' ,
      server: 'dev/server/' ,
      scss: 'dev/client/scss/**/*.scss' ,
      ts: 'dev/client/app/**/*.ts' ,
      img: 'dev/client/img/**/*' ,
      html: 'dev/client/**/*.html'
    } ,
    public: {
      js: 'public/js/' ,
      css: 'public/css/' ,
      img: 'public/img/' ,
      dir: 'public/' ,
      html: 'public/html/'
    },
    dist: {
      js: 'bundle.js'
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