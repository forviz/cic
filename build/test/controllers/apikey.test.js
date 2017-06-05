'use strict';

/* eslint-disable */
process.env.NODE_ENV = 'test';

var jwt = require('jsonwebtoken');
var Space = require('../../app/models/Space');
var Entry = require('../../app/models/Entry');

// Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../app');

var should = chai.should();
var expect = chai.expect;
var token = jwt.sign({ foo: 'bar' }, 'testing');

chai.use(chaiHttp);
// Our parent block
describe('API Key', function () {
  beforeEach(function (done) {
    // Before each test we empty the database
    Space.remove({}, function (err) {
      done();
    });
  });

  /*
   * Test the /POST apikey
   */
  describe('/POST apikey', function () {
    it('it should return created api key', function (done) {

      // Create space
      chai.request(server).post('/v1/spaces/').set('Authorization', 'Bearer ' + token).send({
        name: 'Test Space'
      }).end(function (err, res) {
        var spaceId = res.body.space._id;

        chai.request(server).post('/v1/spaces/' + spaceId + '/api_keys').set('Authorization', 'Bearer ' + token).send({
          name: 'Test Key'
        }).end(function (err, res) {
          res.should.have.status(200);
          res.body.item.should.be.an('object');
          res.body.item.should.have.property('name').eql('Test Key');
          res.body.item.should.have.property('deliveryKey').be.a('String');
          res.body.item.should.have.property('previewKey').be.a('String');

          res.body.space.should.be.an('object');
          res.body.space.should.have.property('apiKeys').be.a('Array');
          expect(res.body.space.apiKeys).to.have.lengthOf(1);
          done();
        });
      });
    });
  });
});
//# sourceMappingURL=apikey.test.js.map