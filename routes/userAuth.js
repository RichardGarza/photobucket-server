const mongoose = require('mongoose');

const UserAuth = (app, User) => {
  const middleWare = (req, res, next) => {
    console.log('Middleware has run.');
    next();
  };

  app.get('/nog', (req, res) => {
    res.send('<h1> NOG </h1>');
  });

  app.post('/signIn', middleWare, (req, res) => {
    // res.json({
    //   test: req.body.email,
    // });
    res.redirect('/nog');

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
