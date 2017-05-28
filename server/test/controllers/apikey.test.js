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
const expect = chai.expect;
const token = jwt.sign({ foo: 'bar' }, 'testing');

chai.use(chaiHttp);
// Our parent block
describe('API Key', () => {
  beforeEach((done) => {
    // Before each test we empty the database
    Space.remove({}, (err) => {
      done();
    });
  });

  /*
   * Test the /POST apikey
   */
  describe('/POST apikey', () => {
    it('it should return created api key', (done) => {

      // Create space
      chai.request(server)
        .post('/v1/spaces/')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test Space'
        })
        .end((err, res) => {
          const spaceId = res.body.space._id;

          chai.request(server)
            .post(`/v1/spaces/${spaceId}/api_keys`)
            .set('Authorization', `Bearer ${token}`)
            .send({
              name: 'Test Key'
            })
            .end((err, res) => {
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
