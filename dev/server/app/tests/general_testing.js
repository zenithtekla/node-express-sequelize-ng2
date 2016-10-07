var request = require('supertest'),
  path = require('path'),
  config = require(path.resolve('./app-config')),
  assert = rrequire('chai').assert,
  should = require('chai').should(),
  // express = require(path.resolve('./bin/www'))
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
/*
describe('loading express', function () {
  var server;
  beforeEach(function () {
    server = require(config.site);
  });
  afterEach(function () {
    server.close();
  });
  it('responds to /', function testSlash(done) {
    request(server)
      .get('/')
      .expect(200, done);
  });
  it('404 everything else', function testPath(done) {
    request(server)
      .get('/foo/bar')
      .expect(404, done);
  });
});*/
