const express = require('express');
const passport = require('passport');
const puppeteer = require('puppeteer');
const tmp = require('tmp');
const next = require('next');
const sass = require('node-sass');
const session = require('express-session');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const postcssMiddleware = require('postcss-middleware');
const routes = require('./routes');
const { parse } = require('url');
const postcssConfig = require('./postcss.config');
const auth = require('./auth')();

// Load environment variables from .env file if present
require('dotenv').load();
require('es6-promise').polyfill();

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';

// Next app creation
const app = next({ dev });
const handle = routes.getRequestHandler(app);

// Express app creation
const server = express();

// Configuring session and cookie options
const sessionOptions = {
  secret: process.env.SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: true
};

if (!dev) {
  const redisClient = redis.createClient(process.env.REDIS_URL);
  sessionOptions.store = new RedisStore({
    client: redisClient,
    logErrors: true
  });
}

// configure Express
server.use(cookieParser());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(session(sessionOptions));
server.use(passport.initialize());
server.use(passport.session());

const isAuthenticated = (req, res, nextAction) => {
  if (req.isAuthenticated()) return nextAction();
  // Fallback to home
  if (req.originalUrl) return res.redirect(`/login?referer=${req.originalUrl}`);
  return res.redirect('/login');
};

// Puppeteer: PDF export
const viewportOptions = { width: 1024, height: 768 };
const gotoOptions = { waitUntil: 'networkidle' };
const getDelayParam = (param) => {
  const n = parseInt(param, 10);
  if (typeof n === 'number' && !isNaN(n)) return n;
  return param || 1000;
};
async function exportPDF(req, res) {
  const tmpDir = tmp.dirSync();
  const fileExtension = req.query.extension || 'pdf';

  const filename = `widget-${req.params.id}-${Date.now()}.${fileExtension}`;
  const filePath = `${tmpDir.name}/${filename}`;

  try {
    // Using Puppeteer
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    const delay = getDelayParam(req.query.waitFor);
    const host = dev ? 'http://localhost:4000' : 'https://kenya-dashboard.vizzuality.com';

    await page.setViewport(viewportOptions);
    await page.goto(`${host}/widget/${req.params.id}?options=${req.query.options}&token=${req.query.token}`, gotoOptions);
    await page.waitFor(delay);

    if (fileExtension === 'pdf') {
      await page.pdf({ path: filePath, format: 'A4' });
    } else {
      await page.screenshot({ path: filePath });
    }

    browser.close();

    const contentType = fileExtension === 'pdf' ? 'application/pdf' : 'image/png';

    res.setHeader('Content-type', contentType);
    res.setHeader('Content-disposition', `attachment; filename=${filename}`);
    res.download(filePath);
  } catch (err) {
    console.error(err);
    res.status(500).send('Something broke!');
  }
}

// Check auth for export
const checkExport = (req, res, nextAction) => {
  if (req.headers['user-agent'].indexOf('HeadlessChrome') !== -1) return nextAction();
  return isAuthenticated(req, res, nextAction);
};

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

    // Configuring next routes with express
    const handleUrl = (req, res) => {
      const parsedUrl = parse(req.url, true);
      return handle(req, res, parsedUrl);
    };

    // Home doesn`t require authentication
    server.get('/', handleUrl);

    // Authentication
    server.post('/login', auth.authenticate(), (req, res) => {
      if (req.query.referer) return res.redirect(req.query.referer);
      return res.redirect('/');
      // res.json(req.user);
    });
    server.get('/logout', (req, res) => {
      req.logout();
      res.redirect('/');
    });

    // Pages with required authentication
    server.get('/about', isAuthenticated, handleUrl);
    server.get('/dashboard', isAuthenticated, handleUrl);
    server.get('/compare', isAuthenticated, handleUrl);
    server.get('/agency/:id', isAuthenticated, handleUrl);
    server.get('/widget/:id', checkExport, handleUrl);
    server.get('/widget/:id/export', exportPDF);
    server.use(handle);

    server.listen(port, (err) => {
      if (err) throw err;
      console.info(`> Ready on http://localhost:${port} [${process.env.NODE_ENV}]`);
    });
  })
  .catch((err) => {
    console.error('An error occurred, unable to start the server');
    console.error(err);
  });
