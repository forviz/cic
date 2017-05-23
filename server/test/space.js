// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const jwt = require('jsonwebtoken');
const token = jwt.sign({ foo: 'bar' }, 'testing');

const Space = require('../app/models/Space');

// Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../app');
const should = chai.should();

chai.use(chaiHttp);
// Our parent block
describe('Spaces', () => {
  beforeEach((done) => { //Before each test we empty the database
    Space.remove({}, (err) => {
      done();
    });
  });
  /*
   * Test the /GET route
   */
  describe('/GET spaces', () => {
    it('it should GET all the spaces', (done) => {
      chai.request(server)
        .get('/v1/spaces')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          console.log('Res', res.body);
          res.should.have.status(200);
          res.body.items.should.be.a('array');
          done();
        });
    });
  });

});
