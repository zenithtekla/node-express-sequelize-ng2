// use Chai's assert and not the assert built into NodeJS
const assert = require('chai').assert;

var path = require('path'),
  config = require(path.resolve('./app-config')),
// connect to your app
  app = require(config.site)
;

// create a session using supertest
const request = require('supertest').agent(app.listen());

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

describe('while logged out', function() {
  it('returns a good homepage', function(done) {
    request.get('/')  // the homepage
      .expect(200)    // successful return
      .end(function(err, res) {
        // run your tests on the content here
        assert.include(res.text, 'Hello World');

        // call done() to confirm that any async tests are completed, and we can move on to the next test
        done(err);
      });
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
