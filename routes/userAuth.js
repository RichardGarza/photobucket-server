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
      err
        ? console.log('Error Finding User')
        : console.log(
            'Found: ' + users.find(user => user.firstName === 'Bobbert').email
          );
    });
  });
};

module.exports = UserAuth;
