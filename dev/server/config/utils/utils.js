'use strict';

var fs      = require('fs'),
  path    = require('path'),
  _       = require('lodash');

module.exports = {
  getDirectories: function (srcpath) {
    return fs.readdirSync(srcpath).filter(function(file) {
      return fs.statSync(path.join(srcpath, file)).isDirectory();
    });
  },
  getFiles: function (srcpath) {
    return fs.readdirSync(srcpath).filter(function(file) {
      return (file.indexOf(".") !== 0) && (file.indexOf("js") !== 0);
    });
  },
  getAppsDir: function (srcpath) {
    return fs.readdirSync(srcpath).filter(function(file) {
      return file!=="core" && file!=="user"
        && fs.statSync(path.join(srcpath, file)).isDirectory();
    });
  }
};

String.prototype.re = function(pattern){
  pattern = (typeof pattern ==='string') ? new RegExp(pattern) : pattern;
  return pattern.test(this);
};