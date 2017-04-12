const Client = require('../../models/oauth2/Client');
const AccessToken = require('../../models/oauth2/AccessToken');

exports.postClients = (req, res, next) => {
  const client = new Client({
    name: req.body.name,
  });

  // client.id = req.body.id;
  // client.secret = req.body.secret;
  // client.userId = req.user._id;

  client.save((err) => {
    if (err) { console.log(err); return next(err); }
    res.json({
      message: 'Client added to the locker',
    });
  });
};

// Create endpoint /api/clients for GET
exports.getClients = (req, res) => {
  // Use the Client model to find all clients
  Client.find({ }, (err, clients) => {
    if (err) res.send(err);

    res.json(clients);
  });
};


exports.getAccessTokens = (req, res) => {
  AccessToken.find({}, (err, tokens) => {
    if (err) res.send(err);
    res.json(tokens);
  });
};
