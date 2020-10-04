const mongoose = require('mongoose');
const crypto = require('crypto');
const User = require('mongoose').model('User');
require('dotenv').config();

const UserAuth = app => {
  const middleWare = (req, res, next) => {
    // console.log('Middleware has run.');
    next();
  };

  const hash = (password, salt) => {
    return crypto
      .pbkdf2Sync(password, salt, 100000, 64, 'sha512')
      .toString('hex');
  };

  app.post('/signIn', middleWare, (req, res) => {
    // Destructure req.body

    const { email, password } = req.body;
    // Access Database /  Search For User
    User.find((err, users) => {
      const foundUser = users.find(user => user.email === email);

      if (foundUser && !err) {
        // If User Found, Verify Password Hash
        const { passwordHash, passwordSalt, firstName, lastName } = foundUser;

        const newHash = hash(password, passwordSalt);

        passwordHash === newHash
          ? res.json({ status: `Verified ${firstName} ${lastName}.` })
          : res.json({ status: 'Not Verified' });
      } else {
        err
          ? res.json({ status: `Error: ${err}` })
          : res.json({ status: 'No User Found' });
      }
    });
  });

  app.post('/signUp', middleWare, (req, res) => {
    // Access Database /  Search For User
    User.find((err, users) => {
      const foundUser = users.find(user => user.email === req.body.email);

      if (foundUser && !err) {
        res.json({ status: 'User Email Already Used' });
      } else {
        err ? res.json({ status: `Error: ${err}` }) : signUp(req.body);
      }
    });

    // Instantiate Model Using Hashed Password
    const signUp = ({ email, password, firstName, lastName }) => {
      if (email && password) {
        const passwordSalt = crypto
          .randomFillSync(Buffer.alloc(10))
          .toString('hex');
        const passwordHash = hash(password, passwordSalt);
        const newUser = new User({
          firstName,
          lastName,
          email,
          passwordHash,
          passwordSalt,
        });

        // Save Model To DB
        newUser.save(function (err, user) {
          if (err) {
            res.json({ status: `Error Creating User` });
          } else {
            res.redirect('/signIn');
          }
          console.log('Saved User: ', user.email);
        });
      } else {
        res.json({ status: `Email or Password Missing` });
      }
    };
  });
};

module.exports = UserAuth;
