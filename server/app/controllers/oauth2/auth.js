const _ = require('lodash');
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
// const BearerStrategy = require('passport-http-bearer').Strategy

const User = require('../../models/User');
const Client = require('../../models/oauth2/Client');
const AccessToken = require('../../models/oauth2/AccessToken');

passport.use('client-basic', new BasicStrategy(
  function (username, password, callback) {
    console.log('username', username);
    console.log('password', password);
    Client.findOne({ id: username }, (err, client) => {
      if (err) { return callback(err); }
      console.log('client', client);

      if (!client || client.oauth_secret !== password) {
        return callback(null, false);
      }

      return callback(null, client);
    });
  }
));

exports.isClientAuthenticated = passport.authenticate('client-basic', { session: false });


// passport.use(new BearerStrategy(
//   function (accessToken, callback) {
//     AccessToken.findOne({ value: accessToken }, (err, token) => {
//       if (err) { return callback(err); }
//
//       // No token found
//       if (!token) { return callback(null, false); }
//
//       User.findOne({ _id: token.userId }, (err, user) => {
//         if (err) { return callback(err); }
//
//         // No user found
//         if (!user) { return callback(null, false); }
//
//         // Simple example with no scope
//         callback(null, user, { scope: '*' });
//       });
//     });
//   }
// ));
//
// exports.isBearerAuthenticated = passport.authenticate('bearer', { session: false });

exports.isAuthenticated = passport.authenticate(['basic', 'bearer'], { session: false });
