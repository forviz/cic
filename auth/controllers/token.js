const passport = require('passport');

// sign with default (HMAC SHA256)
const jwt = require('jsonwebtoken');

exports.getToken = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.send({
        msg: 'Error!',
        info: info,
      });
    }
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      const token = jwt.sign({ uid: user._id }, 'forvizthailand');

      res.send({
        msg: 'Success! You are logged in.',
        token: token,
      });
    });
  })(req, res, next);

  // res.send(`email: ${email}; password: ${password}`);
  // if (req.body.email == 'hello@test.com' && req.body.password == 'test') {
  //       res.status(200)
  //           .json({token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IlRlc3QgVXNlciJ9.J6n4-v0I85zk9MkxBHroZ9ZPZEES-IKeul9ozxYnoZ8'});
  //   } else {
  //       res.sendStatus(403);
  //   }
}
