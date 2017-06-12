/* eslint-disable */
process.env.NODE_ENV = 'test';

const jwt = require('jsonwebtoken');
const Space = require('../../app/models/Space');

// Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app');

const should = chai.should();
const token = jwt.sign({ foo: 'bar' }, 'testing');

chai.use(chaiHttp);

/* TEMPLATE */
const createOrganization = new Promise((resolve, reject) => {
  chai.request(server)
    .post('/v1/organizations')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'Test Space' })
    .end((err, res) => {
      if (err) reject(err);
      resolve(res);
    });
});

const createSpace = new Promise((resolve, reject) => {
  chai.request(server)
    .post('/v1/spaces')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'Test Space' })
    .end((err, res) => {
      if (err) reject(err);
      resolve(res);
    });
});

// Our parent block
describe('Spaces', () => {
  beforeEach((done) => {
    // Before each test we empty the database
    Space.remove({}, (err) => {
      done();
    });
  });

  /*
   * Test the /GET route
   */
  describe('getSpaces', () => {
    it('should GET all the spaces', (done) => {

      createSpace.then(res => {
        chai.request(server)
          .get('/v1/spaces')
          .set('Authorization', `Bearer ${token}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('status').eql('SUCCESS');
            res.body.should.have.property('skip').eql(0);
            res.body.should.have.property('limit').eql(100);

            // No users, so return empty array
            res.body.should.have.property('total').eql(0);
            res.body.items.should.be.a('array').lengthOf(0);
            done();
          });
      });
    });
  });


  describe('createSpace', () => {
    /*
     * (static) createSpace(data, organizationId[opt]) → {Promise.<Space.Space>}
     */
    it('should return created space', (done) => {
      createSpace
      .then((res) => {
        res.should.have.status(200);
        // .space
        res.body.space.should.be.an('object');
        res.body.space.should.have.property('_id');
        res.body.space.should.have.property('name').eql('Test Space');
        res.body.space.should.have.property('defaultLocale').eql('en');

        // sys
        res.body.sys.should.be.an('object');
        res.body.sys.should.have.property('id');
        res.body.sys.should.have.property('type').eql('Space');

        res.body.should.be.an('object');
        res.body.should.have.property('name').eql('Test Space');
        res.body.should.have.property('locales').eql([]);
        done();
      });

    });

    it('should create default organization if no organizationId is provided');
    it('should use organization if organizationId is provided');
  });

  /*
  * Test the /PUT/:id route
  */
  describe('/PUT/:id space', () => {
    it('it should update a space with id', (done) => {
      const space = new Space({ name: 'The Lord of the Rings', defaultLocale: 'en' });
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
   * Test the /GET single
   */
  describe('/GET spaces/:spaceId', () => {
    it('should GET a spaces', (done) => {
      const space = new Space({ name: 'The Lord of the Rings', defaultLocale: 'en' });
      space.save((err, savedSpace) => {
        chai.request(server)
          .get('/v1/spaces/' + savedSpace.id)
          .set('Authorization', `Bearer ${token}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.space.should.have.property('_id').eql(savedSpace.id);
            res.body.space.should.have.property('name').eql('The Lord of the Rings');
            done();
          });
      });
    });

    it('should Error if not found', (done) => {
      chai.request(server)
      .get('/v1/spaces/59253f8b2e3e702664a7306c')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
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
  describe('/DELETE/:id space', () => {
    it('it should update a space with id', (done) => {
      const space = new Space({ name: 'The Lord of the Rings', defaultLocale: 'en' });
      space.save((err, savedSpace) => {
        chai.request(server)
        .delete('/v1/spaces/' + savedSpace.id)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('status').eql('SUCCESSFUL');
          done();

        });
      });
    });
  });
});
