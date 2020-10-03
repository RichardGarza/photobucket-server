const mongoose = require('mongoose');

const UserAuth = (app, User) => {
  const middleWare = (req, res, next) => {
    console.log('Middleware has run.');
    next();
  };

  app.post('/signIn', middleWare, (req, res) => {
    res.json({
      test: req.body.email,
    });

    // Access Database
    User.find((err, users) => {
      const foundUser = users.find(
        user => user.firstName === 'Bobbert' && user.passwordHash
      );

      foundUser && !err
        ? console.log('Found: ' + foundUser)
        : err
        ? console.log(`Error: ${err}`)
        : console.log('No User Found');
    });
  });
};

module.exports = UserAuth;
