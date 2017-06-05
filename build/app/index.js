'use strict';

require('babel-register');
require('babel-polyfill');

var _ = require('lodash');
var moment = require('moment');
var express = require('express');
var flash = require('express-flash');
var compression = require('compression');
var session = require('express-session');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');

// const jwtWebToken = require('jsonwebtoken');
var jwt = require('express-jwt');
var jwks = require('jwks-rsa');

var dotenv = require('dotenv');
var logger = require('morgan');
var chalk = require('chalk');

// const errorHandler = require('errorhandler');
var MongoStore = require('connect-mongo')(session);
var path = require('path');
var mongoose = require('mongoose');
var multer = require('multer');

var Space = require('./models/Space');

var upload = multer({ dest: path.join(__dirname, 'uploads') });

dotenv.load({ path: '.env' });

var spaceController = require('./controllers/space');
var contentTypeController = require('./controllers/space/contentType');
var entryController = require('./controllers/space/entry');
var apiKeyController = require('./controllers/space/apikey');
var assetController = require('./controllers/space/asset');

var organizationController = require('./controllers/account/organization');

var cloudinaryController = require('./controllers/services/cloudinary');

/**
 * Create Express server.
 */
var app = express();

/**
 * Connect to MongoDB.
 */
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI);
mongoose.connection.on('error', function () {
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

app.set('port', process.env.PORT || 4000);
app.use(compression());
app.use(expressValidator());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS middleware
var allowCrossDomain = function allowCrossDomain(req, res, next) {
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
    autoReconnect: true
  })
}));

app.use(flash());
app.use(logger('dev'));

app.use(function (req, res, next) {
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
var contentManagementAuthentication = process.env.NODE_ENV !== 'test' ? jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://forviz.au.auth0.com/.well-known/jwks.json',
    handleSigningKeyError: function handleSigningKeyError(err, cb) {
      if (err instanceof jwks.SigningKeyNotFoundError) {
        return cb(new Error('This is bad'));
      }
      return cb(err);
    }
  }),
  audience: 'content.forviz.com',
  issuer: 'https://forviz.au.auth0.com/',
  algorithms: ['RS256']
}) : jwt({ secret: 'testing' });

var contentDeliveryAuthentication = function contentDeliveryAuthentication(req, res, next) {
  var token = _.replace(req.get('Authorization'), 'Bearer ', '');
  if (token !== '') {
    contentManagementAuthentication(req, res, next);
    return;
  }

  var spaceId = req.params.space_id;
  var accessToken = req.query.access_token;

  Space.findOne({ _id: spaceId }, function (err, space) {
    if (err) {
      res.status(401).send({
        code: 401,
        message: 'This space id is invalid'
      });
    }

    var apiKeysActive = _.filter(space.apiKeys, function (item) {
      return item.active === true;
    });
    if (apiKeysActive.length > 0) {
      var theKey = apiKeysActive.find(function (item) {
        return item.deliveryKey === accessToken;
      });
      if (theKey && moment().isBefore(theKey.expireDate)) {
        next();
      } else {
        res.status(401).send({
          code: 401,
          message: 'This token has expired'
        });
      }
    } else {
      res.status(401).send({
        code: 401,
        message: 'This space does not have api key'
      });
    }
  });
};

var apiPrefix = '/v1';

app.get(apiPrefix + '/spaces/:space_id/entries', contentDeliveryAuthentication, entryController.getAllEntries);
app.get(apiPrefix + '/spaces/:space_id/entries/:entry_id', contentDeliveryAuthentication, entryController.getSingleEntry);

app.get(apiPrefix + '/spaces/:space_id', contentDeliveryAuthentication, spaceController.getSingle);
app.get(apiPrefix + '/spaces/:space_id/content_types', contentDeliveryAuthentication, contentTypeController.getAllContentTypes);
app.get(apiPrefix + '/spaces/:space_id/content_types/:content_type_id', contentDeliveryAuthentication, contentTypeController.getSingleContentType);
app.get(apiPrefix + '/spaces/:space_id/entries', contentDeliveryAuthentication, entryController.getAllEntries);
app.get(apiPrefix + '/spaces/:space_id/entries/:entry_id', contentDeliveryAuthentication, entryController.getSingleEntry);

app.get(apiPrefix + '/organizations', contentManagementAuthentication, organizationController.getAll);
app.get(apiPrefix + '/organizations/:organization_id', contentManagementAuthentication, organizationController.getSingle);
app.post(apiPrefix + '/organizations', contentManagementAuthentication, organizationController.createOrganization);
app.get(apiPrefix + '/organizations/:organization_id/members', contentManagementAuthentication, organizationController.getAllMemberOrganization); // get all member in organization
app.post(apiPrefix + '/organizations/:organization_id/members', contentManagementAuthentication, organizationController.createMemberOrganization); // add member in organization
app.delete(apiPrefix + '/organizations/:organization_id/members/:user_id', contentManagementAuthentication, organizationController.delMemberOrganization); // delete member in organization

// TODO QUERY entries

/**
 * CIC App codebase: MANAGEMENT
 */
app.get(apiPrefix + '/spaces/', contentManagementAuthentication, spaceController.getAll);
app.post(apiPrefix + '/spaces', contentManagementAuthentication, spaceController.createSpace);
app.put(apiPrefix + '/spaces/:space_id', contentManagementAuthentication, spaceController.updateSpace);
app.delete(apiPrefix + '/spaces/:space_id', contentManagementAuthentication, spaceController.deleteSpace);

app.post(apiPrefix + '/spaces/:space_id/content_types/', contentManagementAuthentication, contentTypeController.createContentType);
app.put(apiPrefix + '/spaces/:space_id/content_types/:content_type_id', contentManagementAuthentication, contentTypeController.updateContentType);
app.delete(apiPrefix + '/spaces/:space_id/content_types/:content_type_id', contentManagementAuthentication, contentTypeController.deleteContentType);

// CREATE entry
app.post(apiPrefix + '/spaces/:space_id/entries/', contentManagementAuthentication, entryController.createEntry);
app.put(apiPrefix + '/spaces/:space_id/entries/:entry_id', contentManagementAuthentication, entryController.updateEntry);
app.delete(apiPrefix + '/spaces/:space_id/entries/:entry_id', contentManagementAuthentication, entryController.deleteEntry);
app.delete(apiPrefix + '/spaces/:space_id/entries_truncate/', contentManagementAuthentication, entryController.truncateEntry);

// API Keys
app.get(apiPrefix + '/spaces/:space_id/api_keys', contentManagementAuthentication, apiKeyController.getAllKey);
app.post(apiPrefix + '/spaces/:space_id/api_keys', contentManagementAuthentication, apiKeyController.createKey);
app.put(apiPrefix + '/spaces/:space_id/api_keys/:key_id', contentManagementAuthentication, apiKeyController.updateKey);
app.delete(apiPrefix + '/spaces/:space_id/api_keys', contentManagementAuthentication, apiKeyController.clearAllKey);
app.delete(apiPrefix + '/spaces/:space_id/api_keys/:key_id', contentManagementAuthentication, apiKeyController.deleteKey);

// Assets
app.get(apiPrefix + '/spaces/:space_id/assets/:asset_id', contentManagementAuthentication, assetController.getSingleAsset);
app.post(apiPrefix + '/spaces/:space_id/assets/', contentManagementAuthentication, assetController.createAsset);
app.put(apiPrefix + '/spaces/:space_id/assets/:asset_id', contentManagementAuthentication, assetController.updateAsset);
app.delete(apiPrefix + '/spaces/:space_id/assets/:asset_id', contentManagementAuthentication, assetController.deleteAsset);
app.delete(apiPrefix + '/spaces/:space_id/assets_truncate/', contentManagementAuthentication, assetController.truncateAsset);

// Upload Media (cloudinary)
app.post(apiPrefix + '/media/upload', upload.single('file'), cloudinaryController.upload);
app.get(apiPrefix + '/media/:param?/:public_id', cloudinaryController.getImage);

// Image api
// app.get('/img/:param?/:public_id', cloudinaryController.getImage);
// app.post(`/upload`, upload.single('file'), cloudinaryController.upload);


/**
 * CIC App codebase: WEBUI
 */
app.use(express.static(path.join(__dirname, 'webui')));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'webui', 'index.html'));
});

/**
 * Start Express server.
 */

app.listen(app.get('port'), function () {
  console.log('%s CICAPP service is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
//# sourceMappingURL=index.js.map