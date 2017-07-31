// eslint-disable-line global-require

const express = require('express');
const passport = require('passport');
const next = require('next');
const cookieSession = require('cookie-session');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
// const basicAuth = require('basic-auth');
const routes = require('./routes');

// Load environment variables from .env file if present
require('dotenv').load();

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';

// Next app creation
const app = next({ dev });
const handle = routes.getRequestHandler(app);

// Express app creation
const server = express();

// Passport session setup.
// To support persistent login sessions, Passport needs to be able to
// serialize users into and deserialize users out of the session.
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// configure Express
server.use(cookieParser());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(cookieSession({
  name: 'session',
  keys: [process.env.SECRET || 'keyboard cat']
}));
server.use(session({
  secret: process.env.SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

// Initialize Passport!
server.use(passport.initialize());
server.use(passport.session());

// Initializing next app before express server
app.prepare()
  .then(() => {
    // Public/landing page
    server.get('/', (req, res) => (
      app.render(req, res, '/')
    ));

    server.use(handle);

    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
    });
  });
