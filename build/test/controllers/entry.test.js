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
var token = jwt.sign({ foo: 'bar' }, 'testing');

chai.use(chaiHttp);
// Our parent block
describe('Entry', function () {
  beforeEach(function (done) {
    // Before each test we empty the database
    Space.remove({}, function (err) {
      done();
    });
  });

  /*
   * Test the /POST entry
   */
  describe('/POST entry', function () {
    it('it should return created entry', function (done) {

      // Create space
      chai.request(server).post('/v1/spaces/').set('Authorization', 'Bearer ' + token).send({
        name: 'Test Space'
      }).end(function (err, res) {
        var spaceId = res.body.space._id;
        // Create ContentType
        chai.request(server).post('/v1/spaces/' + spaceId + '/content_types').set('Authorization', 'Bearer ' + token).send({
          name: 'Article',
          fields: [{
            identifier: 'title',
            name: 'Title',
            required: 1,
            localized: 1,
            type: 'Text'
          }, {
            identifier: 'body',
            name: 'Body',
            required: 1,
            localized: 1,
            type: 'Text'
          }]
        }).end(function (err, res) {
          var contentTypeId = res.body.sys.id;
          var fields = {
            title: "Hello Entry",
            body: "lorem ipsum bla bla bla"
          };
          // Create Entry
          chai.request(server).post('/v1/spaces/' + spaceId + '/entries').set('Authorization', 'Bearer ' + token).set('x-cic-content-type', contentTypeId).send({
            fields: fields
          }).end(function (err, res) {
            res.should.have.status(200);
            res.body.entry.should.be.an('object');
            res.body.entry.should.have.property('fields').eql(fields);

            var entryId = res.body.entry._id;
            var updateFields = {
              title: 'Hello Update Entry',
              body: 'Update Body'
            };

            // Update Entry
            chai.request(server).put('/v1/spaces/' + spaceId + '/entries/' + entryId).set('Authorization', 'Bearer ' + token).set('x-cic-content-type', contentTypeId).send({
              fields: updateFields
            }).end(function (err, res) {
              res.should.have.status(200);
              res.body.entry.should.be.an('object');
              res.body.entry.should.have.property('fields').eql(updateFields);
              done();
            });
          });
        });
      });
    });
  });
});
//# sourceMappingURL=entry.test.js.map