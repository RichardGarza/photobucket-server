require('dotenv').config();

const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('express-flash');
const cors = require('cors');

module.exports = {
  init(app) {
    // Init Middleware
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(methodOverride('_method'));
    app.use(cors());
    app.use(
      session({
        secret: process.env.cookieSecret,
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 1.21e9 },
      })
    );
    app.use(flash());

    // Start Server
    const PORT = process.env.PORT || 3080;

    app.listen(PORT, () => {
      console.log(`App is listening on port: ${PORT}`);
    });

    app.use(flash());
  },
};
