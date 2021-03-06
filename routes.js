// routes.js
const nextRoutes = require('next-routes');

const routes = nextRoutes();

// ========================= APP ROUTES =====================
routes.add('home', '/', 'index');
routes.add('dashboard', '/dashboard', 'dashboard');
routes.add('compare', '/compare', 'compare');
routes.add('about', '/about', 'about');
routes.add('agency', '/agency/:id', 'agency');
routes.add('widget', '/widget/:id', 'widget');
routes.add('login', '/login', 'login');
routes.add('reset-password', '/reset-password', 'reset-password');

module.exports = routes;
