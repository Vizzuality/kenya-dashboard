// eslint-disable-line global-require

const express = require('express');
const passport = require('passport');
const next = require('next');
const sass = require('node-sass');
const session = require('express-session');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const postcssMiddleware = require('postcss-middleware');
const routes = require('./routes');
const postcssConfig = require('./postcss.config');

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

// Configuring session and cookie options
const sessionOptions = {
  secret: process.env.SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {}
};

if (!dev) {
  const redisClient = redis.createClient(process.env.REDIS_URL);
  server.set('trust proxy', 1);
  sessionOptions.cookie.secure = true;
  sessionOptions.store = new RedisStore({
    client: redisClient,
    no_ready_check: true,
    ttl: 600,
    logErrors: true
  });
}

// configure Express
server.use(cookieParser());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(session(sessionOptions));

// Initialize Passport!
server.use(passport.initialize());
server.use(passport.session());

// Initializing next app before express server
app.prepare()
  .then(() => {
    if (!dev) {
      // Add route to serve compiled SCSS from /assets/{build id}/main.css
      // Note: This is is only used in production, in development it is inlined
      const sassResult = sass.renderSync({ file: './css/index.scss', outputStyle: 'compressed' });
      server.get('/styles/:id/index.css', postcssMiddleware(postcssConfig), (req, res) => {
        res.setHeader('Content-Type', 'text/css');
        res.setHeader('Cache-Control', 'public, max-age=2592000');
        res.setHeader('Expires', new Date(Date.now() + 2592000000).toUTCString());
        res.send(sassResult.css);
      });
    }

    server.all('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(port, (err) => {
      if (err) throw err;
      console.info(`> Ready on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('An error occurred, unable to start the server');
    console.error(err);
  });
