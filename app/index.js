require('babel-register');
require('babel-polyfill');

const express = require('express');
const flash = require('express-flash');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

const jwt = require('express-jwt');
// const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');
const logger = require('morgan');
const chalk = require('chalk');

// const errorHandler = require('errorhandler');
const MongoStore = require('connect-mongo')(session);
const path = require('path');
const passport = require('passport');
const mongoose = require('mongoose');
const multer = require('multer');

const upload = multer({ dest: path.join(__dirname, 'uploads') });

dotenv.load({ path: `.env.${process.env.NODE_ENV}` });

const passportConfig = require('./config/passport');

const spaceController = require('./controllers/space');
const contentTypeController = require('./controllers/space/contentType');
const entryController = require('./controllers/space/entry');
const apiKeyController = require('./controllers/space/apikey');
const assetController = require('./controllers/space/asset');

const cloudinaryController = require('./controllers/services/cloudinary');

const oauth2Controller = require('./controllers/oauth2/index');
const authController = require('./controllers/oauth2/auth');
const clientController = require('./controllers/oauth2/client');

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

app.set('port', process.env.APIPORT || 4000);
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
    autoReconnect: true
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(logger('dev'));

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// app.use((req, res, next) => {
//   // After successful login, redirect back to the intended page
//   if (!req.user &&
//       req.path !== '/login' &&
//       req.path !== '/signup' &&
//       !req.path.match(/^\/auth/) &&
//       !req.path.match(/\./)) {
//     req.session.returnTo = req.path;
//   } else if (req.user) {
//     req.session.returnTo = req.path;
//   }
//   next();
// });

/**
 * CIC App codebase: DELIVERY
 */

app.get('/', (req, res, next) => {
  console.log('req.user', req.user);
  res.send({ user: req.user });
});

// const tokenAuthenticate = jwt({
//   secret: 'shhhhh'
// });

const contentDeliveryAuthentication = (req, res, next) => {
  next();
};

const contentManagementAuthentication = (req, res, next) => {
  next();
  //return passportConfig.isBearerAuthenticated
};

const apiPrefix = '/v1';
app.get(`${apiPrefix}/spaces/`, contentDeliveryAuthentication, spaceController.getAll);
app.get(`${apiPrefix}/spaces/:space_id`, contentDeliveryAuthentication, spaceController.getSingle);
app.get(`${apiPrefix}/spaces/:space_id/content_types`, contentDeliveryAuthentication, contentTypeController.getAllContentTypes);
app.get(`${apiPrefix}/spaces/:space_id/content_types/:content_type_id`, contentDeliveryAuthentication, contentTypeController.getSingleContentType);
app.get(`${apiPrefix}/spaces/:space_id/entries`, contentDeliveryAuthentication, entryController.getAllEntries);
app.get(`${apiPrefix}/spaces/:space_id/entries/:entry_id`, contentDeliveryAuthentication, entryController.getSingleEntry);



// TODO QUERY entries

/**
 * CIC App codebase: MANAGEMENT
 */

app.post(`${apiPrefix}/spaces`, contentManagementAuthentication, spaceController.createSpace);
app.put(`${apiPrefix}/spaces/:space_id`, contentManagementAuthentication, spaceController.updateSpace);
app.delete(`${apiPrefix}/spaces/:space_id`, contentManagementAuthentication, spaceController.deleteSpace);

app.post(`${apiPrefix}/spaces/:space_id/content_types/`, contentManagementAuthentication, contentTypeController.createContentType);
app.put(`${apiPrefix}/spaces/:space_id/content_types/:content_type_id`, contentManagementAuthentication, contentTypeController.updateContentType);
app.delete(`${apiPrefix}/spaces/:space_id/content_types/:content_type_id`, contentManagementAuthentication, contentTypeController.deleteContentType);

// CREATE entry
app.post(`${apiPrefix}/spaces/:space_id/entries/`, contentManagementAuthentication, entryController.createEntry);
app.put(`${apiPrefix}/spaces/:space_id/entries/:entry_id`, contentManagementAuthentication, entryController.updateEntry);
app.delete(`${apiPrefix}/spaces/:space_id/entries/:entry_id`, contentManagementAuthentication, entryController.deleteEntry);
app.delete(`${apiPrefix}/spaces/:space_id/entries_truncate/`, contentManagementAuthentication, entryController.truncateEntry);

// API Keys
app.get(`${apiPrefix}/spaces/:space_id/api_keys`, contentManagementAuthentication, apiKeyController.getAllKey);
app.post(`${apiPrefix}/spaces/:space_id/api_keys`, contentManagementAuthentication, apiKeyController.createKey);
app.put(`${apiPrefix}/spaces/:space_id/api_keys/:key_id`, contentManagementAuthentication, apiKeyController.updateKey);
app.delete(`${apiPrefix}/spaces/:space_id/api_keys`, contentManagementAuthentication, apiKeyController.clearAllKey);
app.delete(`${apiPrefix}/spaces/:space_id/api_keys/:key_id`, contentManagementAuthentication, apiKeyController.deleteKey);

// Assets
app.get(`${apiPrefix}/spaces/:space_id/assets`, contentManagementAuthentication, assetController.getAllAssets);
app.get(`${apiPrefix}/spaces/:space_id/assets/:asset_id`, contentManagementAuthentication, assetController.getSingleAsset);
app.post(`${apiPrefix}/spaces/:space_id/assets/`, contentManagementAuthentication, assetController.createAsset);
app.put(`${apiPrefix}/spaces/:space_id/assets/:asset_id`, contentManagementAuthentication, assetController.updateAsset);
app.delete(`${apiPrefix}/spaces/:space_id/assets/:asset_id`, contentManagementAuthentication, assetController.deleteAsset);
app.delete(`${apiPrefix}/spaces/:space_id/assets_truncate/`, contentManagementAuthentication, assetController.truncateAsset);

// Upload Media (cloudinary)
app.post(`${apiPrefix}/media/upload`, upload.single('file'), cloudinaryController.upload);
app.get(`${apiPrefix}/media/:param?/:public_id`, cloudinaryController.getImage);


// Image api
// app.get('/img/:param?/:public_id', cloudinaryController.getImage);
// app.post(`/upload`, upload.single('file'), cloudinaryController.upload);


/**
 * CIC App codebase: GOD
 */
app.get('/access_tokens', clientController.getAccessTokens);

/**
 * CIC App codebase: AUTH
 */
app.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));
app.get('/auth/facebook/callback', (req, res, next) => {
  res.redirect(req.session.returnTo || '/');
});

/**
 * CIC App codebase: OAUTH2
 * passportConfig.isAuthenticated,
 */
app.get('/oauth2/authorize', passportConfig.isAuthenticated, oauth2Controller.authorization);
app.post('/oauth2/authorize', passportConfig.isAuthenticated, oauth2Controller.decision);

 // Create endpoint handlers for oauth2 token
app.post('/oauth2/token', authController.isClientAuthenticated, oauth2Controller.token);

app.post('/clients', clientController.postClients);
app.get('/clients', clientController.getClients);

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log('%s CICAPP service is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env')); 
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
