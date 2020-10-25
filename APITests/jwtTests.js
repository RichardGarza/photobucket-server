const axios = require('axios');

console.log('Testing Has Begun...');

// Instantiate Test Results Object
let results = {
  noIdTest: null,
  noRoleTest: null,
  noCredentialTest: null,
  goodCredentialTest: null,
  goodTokenTest: null,
  expiredTokenTest: null,
  invalidTokenTest: null,
};

// Instantiate Various Potential Login Credentials Objects / JWTs

const goodCredentials = {
  userId: 'theUserId',
  userRole: 'theUserRole',
};

const noId = {
  userRole: 'theUserRole',
};

const noRole = {
  userId: 'theUserId',
};

const noCredentials = {};

const expiredToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0aGVVc2VySWQiLCJ1c2VyUm9sZSI6InRoZVVzZXJSb2xlIiwiaWF0IjoxNjAzNjU5NTcyLCJleHAiOjE2MDM2NTk2OTJ9.98LPqN35s0hYtt9M8hkhD1MLWEUAF8VfzKru9Yxy05k';

const invalidToken =
  'eyJhbGciOiJ2UzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0aGVVc2VySWQiLCJ1c2VyUm9sZSI6InRoZVVzZXJSb2xlIiwiaWF0IjoxNjAzNjU5NTcyLCJleHAiOjE2MDM2NTk2OTJ9.98LPqN35s0hYtt9M8hkhD1MLWEUAF8VfzKru9Yxy05k';

// ATTEMPT SIGN IN WITH GOOD CREDENTIALS
axios
  .post('http://localhost:3080/signin', goodCredentials)
  .then(function (res) {
    if (
      res.data.body.userId === goodCredentials.userId &&
      res.data.body.userRole === goodCredentials.userRole &&
      res.data.token &&
      res.data.verified === 'Yes'
    ) {
      results.goodCredentialTest = true;
    } else {
      results.goodCredentialTest = false;
    }

    // ATTEMPT SIGN IN WITH GOOD TOKEN (Continued On Line 114)
    signInUsingGoodToken(res.data.token);
  })
  .catch(function (error) {
    // handle error
    results.goodCredentialTest = error;
  });

// ATTEMPT SIGN IN WITH NO ID
axios
  .post('http://localhost:3080/signin', noId)
  .then(function (res) {
    if (
      res.data.ErrorName === 'Missing User Info or Token' &&
      res.data.verified === 'NO'
    ) {
      results.noIdTest = true;
    } else {
      results.noIdTest = false;
    }
  })
  .catch(function (error) {
    // handle error
    results.noIdTest = error;
  });

// ATTEMPT SIGN IN WITH NO ROLE
axios
  .post('http://localhost:3080/signin', noRole)
  .then(function (res) {
    if (
      res.data.ErrorName === 'Missing User Info or Token' &&
      res.data.verified === 'NO'
    ) {
      results.noRoleTest = true;
    } else {
      results.noRoleTest = false;
    }
  })
  .catch(function (error) {
    // handle error
    results.noRoleTest = error;
  });

// ATTEMPT SIGN IN WITH NO CREDENTIALS
axios
  .post('http://localhost:3080/signin', noCredentials)
  .then(function (res) {
    if (
      res.data.ErrorName === 'Missing User Info or Token' &&
      res.data.verified === 'NO'
    ) {
      results.noCredentialTest = true;
    } else {
      results.noCredentialTest = false;
    }
  })
  .catch(function (error) {
    // handle error
    results.noCredentialTest = error;
  });

// ATTEMPT SIGN IN WITH GOOD TOKEN (Continued from Line 52)

const signInUsingGoodToken = token => {
  axios
    .post('http://localhost:3080/signin', { token })
    .then(function (res) {
      if (res.data.token === token && res.data.verified) {
        results.goodTokenTest = true;
      } else {
        results.goodTokenTest = false;
      }
    })
    .catch(function (error) {
      // handle error
      results.goodTokenTest = error;
    });
};

// ATTEMPT SIGN IN WITH EXPIRED TOKEN

axios
  .post('http://localhost:3080/signin', { token: expiredToken })
  .then(function (res) {
    if (
      res.data.verified === 'NO' &&
      res.data.ErrorName === 'TokenExpiredError' &&
      res.data.ErrorMessage === 'jwt expired'
    ) {
      results.expiredTokenTest = true;
    } else {
      results.expiredTokenTest = false;
    }
  })
  .catch(function (error) {
    // handle error
    results.expiredTokenTest = error;
  });

// ATTEMPT SIGN IN WITH INVALID TOKEN

axios
  .post('http://localhost:3080/signin', { token: invalidToken })
  .then(function (res) {
    if (
      res.data.verified === 'NO' &&
      res.data.ErrorName === 'JsonWebTokenError'
    ) {
      results.invalidTokenTest = true;
    } else {
      results.invalidTokenTest = false;
    }
  })
  .catch(function (error) {
    // handle error
    results.invalidTokenTest = error;
  });

setTimeout(() => {
  console.log('Passed: ', results);
}, 2000);
