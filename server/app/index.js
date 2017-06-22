/* eslint-disable no-console */
require('babel-register');
require('babel-polyfill');

const _ = require('lodash');
const moment = require('moment');
const express = require('express');
const flash = require('express-flash');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

// const jwtWebToken = require('jsonwebtoken');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');


const dotenv = require('dotenv');
const logger = require('morgan');
const chalk = require('chalk');

// const errorHandler = require('errorhandler');
const MongoStore = require('connect-mongo')(session);
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');

const Space = require('./models/Space');

const upload = multer({ dest: path.join(__dirname, 'uploads') });

dotenv.load({ path: '.env' });


const spaceController = require('./controllers/space');
const contentTypeController = require('./controllers/space/contentType');
const entryController = require('./controllers/space/entry');
const apiKeyController = require('./controllers/space/apikey');
const assetController = require('./controllers/space/asset');

const organizationController = require('./controllers/account/organization');

const cloudinaryController = require('./controllers/services/cloudinary');

const applicationController = require('./controllers/application/api');

/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 */
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI);
mongoose.connection.on('error', () => {
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

app.set('port', process.env.PORT || 4000);
app.use(compression());
app.use(expressValidator());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS middleware
const allowCrossDomain = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-CIC-Content-Type');
  next();
};

app.use(allowCrossDomain);

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    url: process.env.MONGODB_URI || process.env.MONGOLAB_URI,
    autoReconnect: true,
  }),
}));

app.use(flash());
app.use(logger('dev'));

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

/**
 * CIC App codebase: DELIVERY
 */

// app.get('/', (req, res, next) => {
//   console.log('req.user', req.user);
//   res.send({ user: req.user });
// });

// const tokenAuthenticate = jwt({
//   secret: 'shhhhh'
// });
const contentManagementAuthentication = process.env.NODE_ENV !== 'test' ? jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://forviz.au.auth0.com/.well-known/jwks.json',
    handleSigningKeyError: (err, cb) => {
      if (err instanceof jwks.SigningKeyNotFoundError) {
        return cb(new Error('This is bad'));
      }
      return cb(err);
    },
  }),
  audience: 'content.forviz.com',
  issuer: 'https://forviz.au.auth0.com/',
  algorithms: ['RS256'],
}) : jwt({ secret: 'testing' });

// Short Name
const cma = contentManagementAuthentication;

const contentDeliveryAuthentication = (req, res, next) => {
  const token = _.replace(req.get('Authorization'), 'Bearer ', '');
  if (token !== '') {
    cma(req, res, next);
    return;
  }

  try {
    const spaceId = req.params.space_id;
    const accessToken = req.query.access_token;

    Space.findOne({ _id: spaceId }, (err, space) => {
      if (err) {
        res.status(401).send({
          code: 401,
          message: 'This space id is invalid',
        });
      }

      const apiKeysActive = _.filter(space.apiKeys, item => item.active === true);
      if (apiKeysActive.length > 0) {
        const theKey = apiKeysActive.find(item => item.deliveryKey === accessToken);
        if (theKey && moment().isBefore(theKey.expireDate)) {
          next();
        } else {
          res.status(401).send({
            sys: { type: 'Error', id: 'AccessTokenInvalid' },
            message: 'The access token you sent could not be found or is invalid.',
            requestId: 'NONE',
          });
        }
      } else {
        res.status(401).send({
          code: 401,
          message: 'This space does not have api key',
        });
      }
    });
  } catch (e) {
    console.log(e);
  }
};

const apiPrefix = '/v1';

app.get(`${apiPrefix}/spaces/:space_id/entries`, contentDeliveryAuthentication, entryController.getAllEntries);
app.get(`${apiPrefix}/spaces/:space_id/entries/:entry_id`, contentDeliveryAuthentication, entryController.getSingleEntry);

app.get(`${apiPrefix}/spaces/:space_id`, contentDeliveryAuthentication, spaceController.getSingle);
app.get(`${apiPrefix}/spaces/:space_id/content_types`, contentDeliveryAuthentication, contentTypeController.getAllContentTypes);
app.get(`${apiPrefix}/spaces/:space_id/content_types/:content_type_id`, contentDeliveryAuthentication, contentTypeController.getSingleContentType);
app.get(`${apiPrefix}/spaces/:space_id/entries`, contentDeliveryAuthentication, entryController.getAllEntries);
app.get(`${apiPrefix}/spaces/:space_id/entries/:entry_id`, contentDeliveryAuthentication, entryController.getSingleEntry);

app.get(`${apiPrefix}/organizations`, cma, organizationController.getAll);
app.get(`${apiPrefix}/organizations/:organization_id`, cma, organizationController.getSingle);
app.post(`${apiPrefix}/organizations`, cma, organizationController.createOrganization);
// get all member in organization
app.get(`${apiPrefix}/organizations/:organization_id/members`, cma, organizationController.getAllMemberOrganization);
// add member in organization
app.post(`${apiPrefix}/organizations/:organization_id/members`, cma, organizationController.createMemberOrganization);
// delete member in organization
app.delete(`${apiPrefix}/organizations/:organization_id/members/:user_id`, cma, organizationController.delMemberOrganization);

// TODO QUERY entries

/**
 * CIC App codebase: MANAGEMENT
 */
app.get(`${apiPrefix}/spaces/`, cma, spaceController.getAll);
app.post(`${apiPrefix}/spaces`, cma, spaceController.createSpace);
app.put(`${apiPrefix}/spaces/:space_id`, cma, spaceController.updateSpace);
app.delete(`${apiPrefix}/spaces/:space_id`, cma, spaceController.deleteSpace);

app.post(`${apiPrefix}/spaces/:space_id/content_types/`, cma, contentTypeController.createContentType);
app.put(`${apiPrefix}/spaces/:space_id/content_types/:content_type_id`, cma, contentTypeController.updateContentType);
app.delete(`${apiPrefix}/spaces/:space_id/content_types/:content_type_id`, cma, contentTypeController.deleteContentType);

// CREATE entry
app.post(`${apiPrefix}/spaces/:space_id/entries/`, cma, entryController.createEntry);
app.put(`${apiPrefix}/spaces/:space_id/entries/:entry_id`, cma, entryController.updateEntry);
app.delete(`${apiPrefix}/spaces/:space_id/entries/:entry_id`, cma, entryController.deleteEntry);
app.delete(`${apiPrefix}/spaces/:space_id/entries_truncate/`, cma, entryController.truncateEntry);

// API Keys
app.get(`${apiPrefix}/spaces/:space_id/api_keys`, cma, apiKeyController.getAllKey);
app.post(`${apiPrefix}/spaces/:space_id/api_keys`, cma, apiKeyController.createKey);
app.put(`${apiPrefix}/spaces/:space_id/api_keys/:key_id`, cma, apiKeyController.updateKey);
app.delete(`${apiPrefix}/spaces/:space_id/api_keys`, cma, apiKeyController.clearAllKey);
app.delete(`${apiPrefix}/spaces/:space_id/api_keys/:key_id`, cma, apiKeyController.deleteKey);

// Assets
app.get(`${apiPrefix}/spaces/:space_id/assets/:asset_id`, cma, assetController.getSingleAsset);
app.post(`${apiPrefix}/spaces/:space_id/assets/`, cma, assetController.createAsset);
app.put(`${apiPrefix}/spaces/:space_id/assets/:asset_id`, cma, assetController.updateAsset);
app.delete(`${apiPrefix}/spaces/:space_id/assets/:asset_id`, cma, assetController.deleteAsset);
app.delete(`${apiPrefix}/spaces/:space_id/assets_truncate/`, cma, assetController.truncateAsset);

// Upload Media (cloudinary)
app.post(`${apiPrefix}/media/upload`, upload.single('file'), cloudinaryController.upload);
app.get(`${apiPrefix}/media/:param?/:public_id`, cloudinaryController.getImage);


// Application
app.get(`${apiPrefix}/application`, applicationController.getAllApplication);
app.get(`${apiPrefix}/application/:id`, applicationController.getApplication);
app.post(`${apiPrefix}/application`, applicationController.createApplication);
app.put(`${apiPrefix}/application/:id`, applicationController.updateApplication);
app.delete(`${apiPrefix}/application/:id`, applicationController.deleteApplication);


// Image api
// app.get('/img/:param?/:public_id', cloudinaryController.getImage);
// app.post(`/upload`, upload.single('file'), cloudinaryController.upload);


/**
 * CIC App codebase: WEBUI
 */
app.use(express.static(path.join(__dirname, 'webui')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'webui', 'index.html'));
});

/**
 * Start Express server.
 */

app.listen(app.get('port'), () => {
  console.log('%s CICAPP service is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});


module.exports = app;
