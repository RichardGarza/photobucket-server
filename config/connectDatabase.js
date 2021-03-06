require('dotenv').config();
const mongoose = require('mongoose');

// Connect To Database
mongoose.connect(process.env.databaseURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
  console.log('Connected to Database');
});

module.exports = mongoose;
