// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const jwt = require('jsonwebtoken');
const token = jwt.sign({ foo: 'bar' }, 'testing');

const mongoose = require("mongoose");
const Space = require('../../app/models/Space');

// Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app');
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
  describe('/POST space', () => {
    it('it should return created space/user/organization', (done) => {
      chai.request(server)
        .post('/v1/spaces')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Test Space' })
        .end((err, res) => {
          console.log('error');
          console.log(err);
          console.log('res');
          console.log(res);
          res.should.have.status(200);
          res.body.space.should.be.an('object');
          res.body.space._id.should.be.an('string');
          res.body.space.name.should.equal('Test Space');
          res.body.space.defaultLocale.should.equal('en');

          res.body.user.should.be.a('object');
          res.body.user._id.should.be.a('string');

          res.body.organization.should.be.an('object');
          res.body.organization._id.should.be.a('string');
          done();
        });
    });
  });

  /*
  * Test the /GET/:id route
  */
  describe('/PUT/:id space', () => {
    it('it should update a space id', (done) => {
      let space = new Space({ name: 'The Lord of the Rings', defaultLocale: 'en' });
      space.save((err, savedSpace) => {
        chai.request(server)
        .put('/v1/spaces/' + savedSpace.id)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Harry Potter' })
        .end((err, res) => {
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
  describe('/GET spaces', () => {
    it('it should GET all the spaces', (done) => {
      chai.request(server)
        .get('/v1/spaces')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.items.should.be.a('array');
          done();
        });
    });
  });

});
