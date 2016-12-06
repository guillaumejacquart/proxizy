/**
 * Module dependencies.
 */
const express = require('express');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const NedbStore = require('express-nedb-session')(session);
const flash = require('express-flash');
const path = require('path');
const passport = require('passport');
const expressValidator = require('express-validator');
const expressStatusMonitor = require('express-status-monitor');
const sass = require('node-sass-middleware');
const multer = require('multer');

const upload = multer({ dest: path.join(__dirname, 'uploads') });

var options = {};

module.exports = function(optionsArgs){
	options.session_secret = optionsArgs.session_secret || 'SECRET';
	
	/**
	 * Controllers (route handlers).
	 */
	const homeController = require('./controllers/home');
	const userController = require('./controllers/user');
	const appController = require('./controllers/app');
	const usersController = require('./controllers/users');
	const proxyController = require('./controllers/proxy');

	/**
	 * API keys and Passport configuration.
	 */
	const passportConfig = require('./config/passport');

	/**
	 * Create Express server.
	 */
	const app = express();

	/**
	 * Express configuration.
	 */
	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'pug');
	app.use(expressStatusMonitor());
	app.use(compression());
	app.use(sass({
	  src: path.join(__dirname, 'public'),
	  dest: path.join(__dirname, 'public')
	}));
	app.use(logger('dev'));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(expressValidator());
	app.use(session({
	  resave: true,
	  saveUninitialized: true,
	  secret: options.session_secret,
	  store: new NedbStore({ filename: 'data/session.db' })
	}));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(flash());
	app.use((req, res, next) => {
	  if (req.path === '/api/upload') {
		next();
	  } else {
		lusca.csrf()(req, res, next);
	  }
	});
	app.use(lusca.xframe('SAMEORIGIN'));
	app.use(lusca.xssProtection(true));
	app.use((req, res, next) => {
	  res.locals.user = req.user;
	  next();
	});
	app.use((req, res, next) => {
	  // After successful login, redirect back to the intended page
	  if (!req.user &&
		  req.path !== '/login' &&
		  req.path !== '/signup' &&
		  !req.path.match(/^\/auth/) &&
		  !req.path.match(/\./)) {
		req.session.returnTo = req.path;
	  } else if (req.user &&
		  req.path == '/account') {
		req.session.returnTo = req.path;
	  }
	  next();
	});
	app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

	/**
	 * Admin app routes.
	 */

	app.get('/login', userController.getLogin);
	app.post('/login', userController.postLogin);
	app.get('/forgot', userController.getForgot);
	app.post('/forgot', userController.postForgot);
	app.get('/reset/:token', userController.getReset);
	app.post('/reset/:token', userController.postReset);
	app.get('/admin/', passportConfig.isAdmin, homeController.index);
	app.get('/admin/logout', passportConfig.isAdmin, userController.logout);
	app.get('/admin/signup', userController.getSignup);
	app.post('/admin/signup', userController.postSignup);
	app.get('/admin/account', passportConfig.isAuthenticated, userController.getAccount);
	app.post('/admin/account/profile', passportConfig.isAuthenticated, userController.postUpdateProfile);
	app.post('/admin/account/password', passportConfig.isAuthenticated, userController.postUpdatePassword);

	app.get('/admin/apps', passportConfig.isAdmin, appController.index);
	app.get('/admin/apps/new', passportConfig.isAdmin, appController.getCreate);
	app.post('/admin/apps/new', passportConfig.isAdmin, appController.postCreate);
	app.get('/admin/apps/:id', passportConfig.isAdmin, appController.getEdit);
	app.post('/admin/apps/:id', passportConfig.isAdmin, appController.postEdit);

	app.get('/admin/users', passportConfig.isAdmin, usersController.index);
	app.get('/admin/users/new', passportConfig.isAdmin, usersController.getCreate);
	app.post('/admin/users/new', passportConfig.isAdmin, usersController.postCreate);
	app.get('/admin/users/:id', passportConfig.isAdmin, usersController.getEdit);
	app.post('/admin/users/:id', passportConfig.isAdmin, usersController.postEdit);
	 
	app.all("*", proxyController.index);

	/**
	 * API examples routes.
	 */

	/**
	 * Error Handler.
	 */
	app.use(errorHandler());
	
	return app;
};
