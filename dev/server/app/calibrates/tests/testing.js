console.log('CALIBRATES testing script!!');

module.exports = function (req, app) {
  it('responds to /table_equipment', function testSlash(done) {
    req(app)
      .get('/table_equipment')
      .expect(200, done);
  });
};