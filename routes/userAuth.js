const mongoose = require('mongoose');
const crypto = require('crypto');
const User = require('mongoose').model('User');
require('dotenv').config();

const middleWare = (req, res, next) => {
  // console.log('Middleware has run.');
  next();
};

const hash = (password, salt) => {
  return crypto
    .pbkdf2Sync(password, salt, 100000, 64, 'sha512')
    .toString('hex');
};

const verifyPassword = (passwordHash, passwordSalt, password) => {
  const newHash = hash(password, passwordSalt);

  if (passwordHash === newHash) {
    return true;
  } else {
    return false;
  }
};

const signUp = (res, { email, password, firstName, lastName }) => {
  if (email && password) {
    // Generate Salt & Hash using provided credentials
    const passwordSalt = crypto
      .randomFillSync(Buffer.alloc(10))
      .toString('hex');
    const passwordHash = hash(password, passwordSalt);

    // Generate New User Model
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
        res.json({ status: 'User Created Successfully', user });
      }
      console.log('Saved User: ', user.email);
    });
  } else {
    res.json({ status: `Email or Password Missing` });
  }
};

const UserAuth = app => {
  app.post('/signIn', middleWare, (req, res) => {
    const { email, password } = req.body;

    // First Search For User
    User.find((err, users) => {
      const foundUser = users.find(user => user.email === email);

      if (foundUser && !err) {
        const { passwordHash, passwordSalt, firstName, lastName } = foundUser;

        // Then Verify Password
        verifyPassword(passwordHash, passwordSalt, password)
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
    // First, Search For Existing User With Provided Email
    User.find((err, users) => {
      const foundUser = users.find(user => user.email === req.body.email);

      if (foundUser && !err) {
        res.json({ status: 'User Email Already Used' });
      } else {
        err ? res.json({ status: `Error: ${err}` }) : signUp(res, req.body);
      }
    });
  });
};

module.exports = UserAuth;
