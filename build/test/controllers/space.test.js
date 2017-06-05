'use strict';

/* eslint-disable */
process.env.NODE_ENV = 'test';

var jwt = require('jsonwebtoken');
var Space = require('../../app/models/Space');

// Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../app');

var should = chai.should();
var token = jwt.sign({ foo: 'bar' }, 'testing');

chai.use(chaiHttp);
// Our parent block
describe('Spaces', function () {
  beforeEach(function (done) {
    // Before each test we empty the database
    Space.remove({}, function (err) {
      done();
    });
  });

  /*
   * Test the /GET route
   */
  describe('/POST space', function () {
    it('it should return created space/user/organization', function (done) {
      chai.request(server).post('/v1/spaces').set('Authorization', 'Bearer ' + token).send({ name: 'Test Space' }).end(function (err, res) {
        res.should.have.status(200);
        res.body.space.should.be.an('object');
        res.body.space.should.have.property('_id');
        res.body.space.should.have.property('name').eql('Test Space');
        res.body.space.should.have.property('defaultLocale').eql('en');

        res.body.user.should.have.property('_id');

        res.body.organization.should.have.property('_id');

        done();
      });
    });
  });

  /*
  * Test the /PUT/:id route
  */
  describe('/PUT/:id space', function () {
    it('it should update a space with id', function (done) {
      var space = new Space({ name: 'The Lord of the Rings', defaultLocale: 'en' });
      space.save(function (err, savedSpace) {
        chai.request(server).put('/v1/spaces/' + savedSpace.id).set('Authorization', 'Bearer ' + token).send({ name: 'Harry Potter' }).end(function (err, res) {
          res.should.have.status(200);
          res.body.space.should.have.property('_id').eql(savedSpace.id);
          res.body.space.should.have.property('name').eql('Harry Potter');
          done();
        });
      });
    });
  });
  /*
   * Test the /GET route
   */
  describe('/GET spaces', function () {
    it('it should GET all the spaces', function (done) {
      chai.request(server).get('/v1/spaces').set('Authorization', 'Bearer ' + token).end(function (err, res) {
        res.should.have.status(200);
        res.body.items.should.be.a('array');
        done();
      });
    });
  });

  /*
   * Test the /GET single
   */
  describe('/GET spaces/:spaceId', function () {
    it('it should GET a spaces', function (done) {
      var space = new Space({ name: 'The Lord of the Rings', defaultLocale: 'en' });
      space.save(function (err, savedSpace) {
        chai.request(server).get('/v1/spaces/' + savedSpace.id).set('Authorization', 'Bearer ' + token).end(function (err, res) {
          res.should.have.status(200);
          res.body.space.should.have.property('_id').eql(savedSpace.id);
          res.body.space.should.have.property('name').eql('The Lord of the Rings');
          done();
        });
      });
    });

    it('it should Error if not found', function (done) {
      chai.request(server).get('/v1/spaces/0000000').set('Authorization', 'Bearer ' + token).end(function (err, res) {
        res.should.have.status(404);
        res.body.sys.should.have.property('type').eql('Error');
        res.body.sys.should.have.property('id').eql('NotFound');
        done();
      });
    });
  });

  /*
  * Test the /DELETE/:id route
  */
  describe('/DELETE/:id space', function () {
    it('it should update a space with id', function (done) {
      var space = new Space({ name: 'The Lord of the Rings', defaultLocale: 'en' });
      space.save(function (err, savedSpace) {
        chai.request(server).delete('/v1/spaces/' + savedSpace.id).set('Authorization', 'Bearer ' + token).end(function (err, res) {
          res.should.have.status(200);
          res.body.should.have.property('status').eql('SUCCESSFUL');
          done();
        });
      });
    });
  });
});
//# sourceMappingURL=space.test.js.map