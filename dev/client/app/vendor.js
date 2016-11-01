module.exports = {
  js: [
    './node_modules/systemjs/dist/system.js',
    './node_modules/rxjs/bundles/Rx.js',
    './node_modules/angular2/bundles/angular2-polyfills.min.js',
    './node_modules/angular2/bundles/angular2.js',
    './node_modules/angular2/bundles/http.js',
    './node_modules/angular2/bundles/router.js',
    './node_modules/angular2/es6/dev/src/testing/shims_for_IE.js'
  ],
  watch: './dev/client/app/vendor.js'
};