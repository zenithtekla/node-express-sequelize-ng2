var request = require('supertest'),
  _ = require('lodash'),
  path = require('path'),
  config = require(path.resolve('./app-config')),
  utils  = require(path.resolve(config.serverConfigDir,'assets/utils')),
  tests       = config.serverApps.tests,
  testConfig  =  {
    tests: tests,
    content: []
  },

  assert = require('chai').assert,
  /*expect = require('chai').expect,
  should = require('chai').should(),*/
  // express = require(path.resolve('./bin/www'))
  // connect to your app
  express = require(config.site)
;
console.log(process.cwd()+'app-config');
describe('my feature', function () {
  it('works', function () {
    assert.equal('A','A');
  });
  it('fails gracefully', function () {
    assert.throws(function () {
      throw 'Error!';
    });
  });
});

describe('my other feature', function () {
  it('async', function (done) {
    setTimeout(function () {
      done();
    }, 25);
  });
});

describe('loading express', function () {
  it('responds to /', function testSlash(done) {
    request(express)
      .get('/')
      .expect(200, done);
  });


  _.forEach(tests, function (test) {
    require(test)(request, express);
    testConfig.content.push({test: test});
  });

  it('404 everything else', function testPath(done) {
    request(express)
      .get('/foo/bar')
      .expect(404, done);
  });
});

utils.exportJSON(testConfig, config.projDir + '/testConfig.json');
