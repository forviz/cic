require('babel-register');
require('babel-polyfill');

const express = require('express');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

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
const cloudinaryController = require('./controllers/asset/cloudinary');

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
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
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
app.use(logger('dev'));


/**
 * CIC App codebase: DELIVERY
 */
const apiPrefix = '/v1';
app.get(`${apiPrefix}/spaces/:space_id`, spaceController.getSingle);
app.get(`${apiPrefix}/spaces/:space_id/content_types`, contentTypeController.getAllContentTypes);
app.get(`${apiPrefix}/spaces/:space_id/content_types/:content_type_id`, contentTypeController.getSingleContentType);
app.get(`${apiPrefix}/spaces/:space_id/entries`, entryController.getAllEntries);
app.get(`${apiPrefix}/spaces/:space_id/entries/:entry_id`, entryController.getSingleEntry);


app.post(`${apiPrefix}/api/upload`, upload.single('myFile'), cloudinaryController.upload);

// TODO QUERY entries

/**
 * CIC App codebase: MANAGEMENT
 */
app.get(`${apiPrefix}/spaces`, passportConfig.isBearerAuthenticated, spaceController.getAll);
app.post(`${apiPrefix}/spaces`, passportConfig.isBearerAuthenticated, spaceController.createSpace);
app.put(`${apiPrefix}/spaces/:space_id`, passportConfig.isBearerAuthenticated, spaceController.updateSpace);
app.delete(`${apiPrefix}/spaces/:space_id`, passportConfig.isBearerAuthenticated, spaceController.deleteSpace);

app.post(`${apiPrefix}/spaces/:space_id/content_types/`, passportConfig.isBearerAuthenticated, contentTypeController.createContentType);
app.put(`${apiPrefix}/spaces/:space_id/content_types/:content_type_id`, passportConfig.isBearerAuthenticated, contentTypeController.updateContentType);
app.delete(`${apiPrefix}/spaces/:space_id/content_types/:content_type_id`, passportConfig.isBearerAuthenticated, contentTypeController.deleteContentType);

// CREATE entry
app.post(`${apiPrefix}/spaces/:space_id/entries/`, passportConfig.isBearerAuthenticated, entryController.createEntry);
app.put(`${apiPrefix}/spaces/:space_id/entries/:entry_id`, passportConfig.isBearerAuthenticated, entryController.updateEntry);
app.delete(`${apiPrefix}/spaces/:space_id/entries/:entry_id`, passportConfig.isBearerAuthenticated, entryController.deleteEntry);
app.delete(`${apiPrefix}/spaces/:space_id/entries_truncate/`, passportConfig.isBearerAuthenticated, entryController.truncateEntry);

// API Keys
app.get(`${apiPrefix}/spaces/:space_id/api_keys`, passportConfig.isBearerAuthenticated, apiKeyController.getAllKey);
app.post(`${apiPrefix}/spaces/:space_id/api_keys`, passportConfig.isBearerAuthenticated, apiKeyController.createKey);
app.put(`${apiPrefix}/spaces/:space_id/api_keys/:key_id`, passportConfig.isBearerAuthenticated, apiKeyController.updateKey);
app.delete(`${apiPrefix}/spaces/:space_id/api_keys`, passportConfig.isBearerAuthenticated, apiKeyController.clearAllKey);
app.delete(`${apiPrefix}/spaces/:space_id/api_keys/:key_id`, passportConfig.isBearerAuthenticated, apiKeyController.deleteKey);

// Assets
app.post(`${apiPrefix}/assets/upload`, upload.single('file'), cloudinaryController.upload);
// app.post('/api/upload', upload.single('myFile'), apiController.postFileUpload);

/**
 * CIC App codebase: GOD
 */
app.get('/access_tokens', clientController.getAccessTokens);

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
