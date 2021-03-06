// Load NPM Packages
const express = require('express');
const LoadMiddleware = require('./config/loadMiddleware');

// Instantiate Express App
const app = express();

// Load Express Middleware + Start Server
LoadMiddleware.init(app);

// Load Database
const mongoose = require('./config/connectDatabase');

// Define Models
const userModel = require('./models/userModel');

// Initialize Models
User = userModel.init(mongoose);

// Import Routes
const UserAuth = require('./routes/userAuth');

// Utilize Routes
UserAuth(app);

// // Example For Using MongoDB
// //
// // First, Define Schema.
// const kittySchema = new mongoose.Schema({
//   name: String,
// });

// // Optionally, add methods to schema
// kittySchema.methods.speak = function () {
//   const greeting = this.name
//     ? 'Meow name is ' + this.name
//     : "I don't have a name";
//   console.log(greeting);
// };

// // Define Model Using Schema
// const Kitten = mongoose.model('Kitten', kittySchema);

// // Instantiate Model
// const silence = new Kitten({ name: 'Silence' });

// // Save Model To DB
// silence.save(function (err, silence) {
//   if (err) return console.error(err);
//   console.log('Saved Cat', silence);
// });

// // Access Properties / methods if you want
// console.log(silence.name); // 'Silence'
// silence.speak(); // "Meow name is fluffy"

// // Access Database
// Kitten.find((err, kittens) => {
//   err ? console.log('ERROR') : console.log(kittens);
// });

// ///////////////////////////////////////////////////////////////////////////////////////////////////

// //
// First, Define Schema.
// const userSchema = new mongoose.Schema({
//   firstName: String,
//   lastName: String,
//   email: String,
//   password: String,
// });

// // Define Model Using Schema
// const User = mongoose.model('User', userSchema);

// // Instantiate Model
// const bobby = new User({
//   firstName: 'Bobbert',
//   lastName: 'Bilchar',
//   email: 'silence@silenc.io',
//   passwordHash: 'HASHHASHASH',
//   passwordSalt: 'SALTSALTSALT',
// });

// // Instantiate Model Using Hashed Password
// const crypto = require('crypto');
// const salt = 'Lawrys';
// const hashedPassword = crypto
//   .pbkdf2Sync('password', salt, 100000, 64, 'sha512')
//   .toString('hex');

// const woody = new User({
//   firstName: 'Woody',
//   lastName: 'Johnson',
//   email: 'admin@secretsaucyness.com',
//   passwordHash: hashedPassword,
//   passwordSalt: salt,
// });

// // Save Model To DB
// woody.save(function (err, bobby) {
//   if (err) return console.error(err);
//   console.log('Saved User', bobby);
// });

// // Access Database
// User.find((err, users) => {
//   err
//     ? console.log('Error Finding User')
//     : console.log(
//         'Found: ' + users.find(user => user.firstName === 'Bobbert').email
//       );
// });
