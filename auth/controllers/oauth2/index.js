const oauth2orize = require('oauth2orize')
const User = require('../../models/User');
const Client = require('../../models/oauth2/Client');
const AccessToken = require('../../models/oauth2/AccessToken');
const Code = require('../../models/oauth2/GrantCode');
const uid = require('uid2');

// Create OAuth 2.0 server
const server = oauth2orize.createServer();
server.serializeClient((client, callback) => {
  return callback(null, client._id);
});

server.deserializeClient((id, callback) => {
  Client.findOne({ _id: id }, (err, client) => {
    if (err) { return callback(err); }
    return callback(null, client);
  });
});

server.grant(oauth2orize.grant.code((client, redirectUri, user, ares, callback) => {
  const code = new Code({
    value: uid(16),
    clientId: client._id,
    userId: user._id,
    redirectUri,
  });

  // Save the auth code and check for errors
  code.save((err) => {
    if (err) { return callback(err); }

    callback(null, code.value);
  });
}));

server.exchange(oauth2orize.exchange.code((client, code, redirectUri, callback) => {
  Code.findOne({ value: code }, (err, authCode) => {
    if (err) { return callback(err); }
    if (authCode === undefined) { return callback(err); }
    if (client._id.toString() !== authCode.clientId) { return callback(null, false); }
    if (redirectUri !== authCode.redirectUri) { return callback(null, false); }

    // Delete auth code now that it has been used
    authCode.remove((err) => {
      if (err) { return callback(err); }

      // Create a new access token
      const token = new AccessToken({
        value: uid(256),
        clientId: authCode.clientId,
        userId: authCode.userId,
      });

      token.save((err) => {
        if (err) { return callback(err); }
        callback(null, token);
      })
    })
  });
}));

// User authorization endpoint
exports.authorization = [
  server.authorization((clientId, redirectUri, callback) => {
    console.log('clientId', clientId);
    console.log('redirectUri', redirectUri);
    Client.findOne({ id: clientId }, (err, client) => {
      if (err) { return callback(err); }
      return callback(null, client, redirectUri);
    });
  }),
  (req, res) => {
    res.render('oauth2/dialog', { transactionID: req.oauth2.transactionID, user: req.user, client: req.oauth2.client });
  }
];

// User decision endpoint
exports.decision = [
  server.decision()
];

// Application client token exchange endpoint
exports.token = [
  server.token(),
  server.errorHandler()
];
