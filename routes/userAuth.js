const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const dayjs = require('dayjs');
const User = require('mongoose').model('User');
require('dotenv').config();
const secret = process.env.cookieSecret;

const middleWare = (req, res, next) => {
  const { body } = req;

  if (body.token) {
    const { token } = body;

    console.log('Token Received: ', token);

    // let verified;

    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        req.body.error = err;
        console.log('ERROR: ', err.name, err.message);
      } else {
        req.body.verified = decoded;
        console.log('decoded: ', decoded);
      }
    });

    // const response = { verified, token };
    // console.log('Verified:  ', response.verified);

    // req.body.verified = verified;
    next();
  } else {
    next();
  }

  // const { userIdCookie, sessionIdCookie } = req.body;
  // if (userIdCookie && sessionIdCookie) {
  // const now = dayjs().$d.toString();

  // User.findOne({ _id: userIdCookie }, (err, foundUser) => {
  //   const { sessionId, sessionExpires } = foundUser;
  //   sessionIdCookie === sessionId && sessionExpires > now
  //     ? console.log('Session Valid ')
  //     : console.log('Session Expired');
  // });
  // }
};

const hash = (password, salt) => {
  return crypto
    .pbkdf2Sync(password, salt, 100000, 64, 'sha512')
    .toString('hex');
};

// const verifyPassword = (passwordHash, passwordSalt, password) => {
//   const newHash = hash(password, passwordSalt);

//   if (passwordHash === newHash) {
//     return true;
//   } else {
//     return false;
//   }
// };

//////////// SIGN UP ///////////////////////////////////////////////////////////////

const signUp = (res, { email, password, firstName, lastName }) => {
  console.log('SignUp UserAuth');
  if (email && password) {
    // Generate Salt & Hash using provided credentials
    const passwordSalt = crypto
      .randomFillSync(Buffer.alloc(10))
      .toString('hex');
    const passwordHash = hash(password, passwordSalt);
    const sessionExpires = dayjs().add(7, 'day').$d.toString();
    const sessionId = hash(sessionExpires, passwordSalt);

    // Generate New User Model
    const newUser = new User({
      firstName,
      lastName,
      email,
      passwordHash,
      passwordSalt,
      sessionId,
      sessionExpires,
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

//////////// SIGN IN ///////////////////////////////////////////////////////////////

const UserAuth = app => {
  app.post('/signIn', middleWare, (req, res) => {
    const { body } = req;
    const { userId, userRole, error } = body;
    let response;

    if (body.verified) {
      const { verified, token } = body;

      response = { verified, token };
      console.log('Verified by middleware!!', response);
      res.json(response);
    } else if (error) {
      console.log('ERROR??');
      response = {
        verified: 'NO',
        ErrorName: error.name,
        ErrorMessage: error.message,
      };
      res.json(response);
    } else if (userId && userRole) {
      console.log('ThisOnee');
      const payload = {
        userId,
        userRole,
      };

      const token = jwt.sign(payload, secret, { expiresIn: 120 });
      response = { verified: 'Yes', body, token };
      res.json(response);
    } else {
      console.log('FARTNOISES');
      response = {
        verified: 'NO',
        ErrorName: 'Missing User Info or Token',
        Received: {
          userId: userId,
          userRole: userRole,
          token: body.token,
        },
      };
      res.json(response);
    }
    console.log('RESPONSE: ', response);

    // const { email, password, userIdCookie } = req.body;
    // console.log('WE MADE IT' , req.body);

    // if (userIdCookie) {
    //   console.log('UserIdCookie', userIdCookie);
    //   User.findOne({ _id: userIdCookie }, (err, foundUser) => {
    //     if (err) {
    //       console.log('Errrrrrr', err);
    //       res.json({
    //         status: `Error: ${err}`,
    //       });
    //     } else if (foundUser) {
    //       console.log('This one', foundUser._id);
    //       res.json({
    //         status: 'Verified with UserId Cookie',
    //         userId: foundUser._id,
    //         userEmail: foundUser.email,
    //       });
    //     } else {
    //       console.log('EMAIL VERIFICATION', email);
    //       User.findOne({ email: email }, (err, foundUser) => {
    //         console.log('found User?', foundUser);
    //         const { passwordHash, passwordSalt } = foundUser;

    //         // Then Verify Password
    //         if (verifyPassword(passwordHash, passwordSalt, password)) {
    //           res.json({
    //             status: 'Cookie Invalid, Verified With Password',
    //             userId: foundUser._id,
    //             userEmail: foundUser.email,
    //           });
    //         } else {
    //           res.json({ status: 'User Not Found' });
    //         }
    //       });
    //     }
    //   });
    // } else {
    //   User.find((err, users) => {
    //     console.log;
    //     const foundUser = users.find(user => user.email === email);

    //     if (foundUser && !err) {
    //       const { passwordHash, passwordSalt, firstName, lastName } = foundUser;

    //       // Then Verify Password
    //       verifyPassword(passwordHash, passwordSalt, password)
    //         ? res.json({
    //             status: 'No Cookie, Verified By Email',
    //             userId: foundUser._id,
    //           })
    //         : res.json({ status: 'Not Verified' });
    //     } else {
    //       err
    //         ? res.json({ status: `Error: ${err}` })
    //         : res.json({ status: 'No User Found' });
    //     }
    //   });
    // }
  });

  app.post('/signUp', middleWare, (req, res) => {
    console.log('OMG');
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
