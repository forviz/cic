/* eslint-disable */
process.env.NODE_ENV = 'test';

const jwt = require('jsonwebtoken');
const Space = require('../../app/models/Space');
const Entry = require('../../app/models/Entry');

// Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app');

const should = chai.should();
const token = jwt.sign({ foo: 'bar' }, 'testing');

chai.use(chaiHttp);
// Our parent block
describe('Entry', () => {
  beforeEach((done) => {
    // Before each test we empty the database
    Space.remove({}, (err) => {
      done();
    });
  });
  /*
   * Test the /GET route
   */
  describe('/POST entry', () => {
    it('it should return created entry', (done) => {

      // Create space
      chai.request(server)
        .post('/v1/spaces/')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test Space'
        })
        .end((err, res) => {
          const spaceId = res.body.space._id;
          // Create ContentType
          chai.request(server)
          .post('/v1/spaces/'+spaceId+'/content_types')
          .set('Authorization', `Bearer ${token}`)
          .send({
            name: 'Article',
            fields: [{
              id: 'title',
              name: 'Title',
              required: 1,
              localized: 1,
              type: 'Text'
            },
            {
              id: 'body',
              name: 'Body',
              required: 1,
              localized: 1,
              type: 'Text'
            }]
          })
          .end((err, res) => {
            const contentTypeId = res.body.sys.id;
            const fields = {
              title: "Hello Entry",
              body: "lorem ipsum bla bla bla"
            };
            // Create Entry
            chai.request(server)
              .post('/v1/spaces/' + spaceId + '/entries')
              .set('Authorization', `Bearer ${token}`)
              .set('x-cic-content-type', contentTypeId)
              .send({
                displayField: 'title',
              	fields,
              })
              .end((err, res) => {
                res.should.have.status(200);
                res.body.entry.should.be.an('object');
                res.body.entry.should.have.property('fields').eql(fields);
                done();
              });

          });
        });
    });
  });

});
