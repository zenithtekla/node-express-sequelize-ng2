'use strict';

var fs     = require('fs'),
  path    = require('path'),
  _       = require('lodash'),
  glob    = require('glob');

var utils = {
  getDirectories: function (srcpath) {
    return fs.readdirSync(srcpath).filter(function(file) {
      return fs.statSync(path.join(srcpath, file)).isDirectory();
    });
  },
  getJSFiles: function (srcpath) {
    return fs.readdirSync(srcpath).filter(function(file) {
      return (file.indexOf(".") !== 0) && (file.indexOf("js") !== 0);
    });
  },
  getFiles: function (srcpath) {
    return fs.readdirSync(srcpath).filter(function(file) {
      return (file.indexOf(".") !== 0) && (file.indexOf("compiled") === -1);
    });
  },
  getAppsDir: function (srcpath) {
    return fs.readdirSync(srcpath).filter(function(file) {
      return file!=="core" && file!=="user"
        && fs.statSync(path.join(srcpath, file)).isDirectory();
    });
  },
  getModelsDir: function (srcpath) {
    return fs
      .readdirSync(srcpath)
      .filter(function(file) {
        return file==="models"
          && fs.statSync(path.join(srcpath, file)).isDirectory();
      });
  },
  getGlobbedPaths: function (globPatterns, excludes) {
    // URL paths regex
    var urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

    // The output array
    var output = [];

    // If glob pattern is array then we use each pattern in a recursive way, otherwise we use glob
    if (_.isArray(globPatterns)) {
      globPatterns.forEach(function (globPattern) {
        output = _.union(output, getGlobbedPaths(globPattern, excludes));
      });
    } else if (_.isString(globPatterns)) {
      if (urlRegex.test(globPatterns)) {
        output.push(globPatterns);
      } else {
        var files = glob.sync(globPatterns);
        if (excludes) {
          files = files.map(function (file) {
            if (_.isArray(excludes)) {
              for (var i in excludes) {
                if (excludes.hasOwnProperty(i)) {
                  file = file.replace(excludes[i], '');
                }
              }
            } else {
              file = file.replace(excludes, '');
            }
            return file;
          });
        }
        output = _.union(output, files);
      }
    }

    return output;
  },
  exportJSON: function (data, outputFile) {
    fs.writeFile(outputFile, JSON.stringify(data, null, 4),
      function(err) {
        if(err) {
          console.log(err);
        } else {
          console.log("JSON saved to " + outputFile);
        }
      }
    );
  }
};

utils.appendJSON = function (data, jsonFile, raw) {
  raw = raw || 'utf8';
  fs.readFile(jsonFile, raw, function (err, fileContent) {
    if (err) throw err;
    else {
      fileContent = JSON.parse(fileContent);
      utils.exportJSON(_.merge(data, fileContent),jsonFile);
    }
  });
};

module.exports = utils;

String.prototype.re = function(pattern){
  pattern = (typeof pattern ==='string') ? new RegExp(pattern) : pattern;
  return pattern.test(this);
};