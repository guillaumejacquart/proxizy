/**
 * Module dependencies.
 */
const express = require('express');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const errorHandler = require('errorhandler');
const NedbStore = require('express-nedb-session')(session);
const flash = require('express-flash');
const path = require('path');
const passport = require('passport');
const expressValidator = require('express-validator');

var options = {};

module.exports = function (optionsArgs) {
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
	app.use(compression());
	app.use(logger('dev'));
	app.use(expressValidator());
	app.use(session({
		resave: true,
		saveUninitialized: true,
		secret: options.session_secret,
		store: new NedbStore({ filename: __dirname + '/data/session.db' }),
		name: 'proxizy.sid'
	}));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(flash());

	app.all(/^((?!proxizy).)*$/, proxyController.index);

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));

	app.use((req, res, next) => {
		res.locals.user = req.user;
		next();
	});
	app.use((req, res, next) => {
		// After successful login, redirect back to the intended page
		if (!req.user &&
			req.path !== '/proxizy/login' &&
			req.path !== '/proxizy/signup' &&
			!req.path.match(/^\/auth/) &&
			!req.path.match(/\./)) {
			req.session.returnTo = req.originalUrl;
		} else if (req.user &&
			req.path == '/proxizy/account') {
			req.session.returnTo = req.originalUrl;
		}
		next();
	});
	app.use('/proxizy', express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

	/**
	 * Admin app routes.
	 */

	app.get('/proxizy/login', userController.getLogin);
	app.post('/proxizy/login', userController.postLogin);
	app.get('/proxizy/forgot', userController.getForgot);
	app.post('/proxizy/forgot', userController.postForgot);
	app.get('/proxizy/reset/:token', userController.getReset);
	app.post('/proxizy/reset/:token', userController.postReset);
	app.get('/proxizy/', passportConfig.isAdmin, homeController.index);
	app.get('/proxizy/logout', passportConfig.isAdmin, userController.logout);
	app.get('/proxizy/signup', userController.getSignup);
	app.post('/proxizy/signup', userController.postSignup);
	app.get('/proxizy/account', passportConfig.isAuthenticated, userController.getAccount);
	app.post('/proxizy/account/profile', passportConfig.isAuthenticated, userController.postUpdateProfile);
	app.post('/proxizy/account/password', passportConfig.isAuthenticated, userController.postUpdatePassword);

	app.get('/proxizy/apps', passportConfig.isAdmin, appController.index);
	app.get('/proxizy/apps/new', passportConfig.isAdmin, appController.getCreate);
	app.post('/proxizy/apps/new', passportConfig.isAdmin, appController.postCreate);
	app.get('/proxizy/apps/:id', passportConfig.isAdmin, appController.getEdit);
	app.post('/proxizy/apps/:id', passportConfig.isAdmin, appController.postEdit);
	app.delete('/proxizy/apps/:id', passportConfig.isAdmin, appController.remove);

	app.get('/proxizy/users', passportConfig.isAdmin, usersController.index);
	app.get('/proxizy/users/new', passportConfig.isAdmin, usersController.getCreate);
	app.post('/proxizy/users/new', passportConfig.isAdmin, usersController.postCreate);
	app.get('/proxizy/users/:id', passportConfig.isAdmin, usersController.getEdit);
	app.post('/proxizy/users/:id', passportConfig.isAdmin, usersController.postEdit);
	app.delete('/proxizy/users/:id', passportConfig.isAdmin, usersController.remove);

	// If nothing matches, redirect to /proxizy
	app.get('/', function(req, res){
		return res.redirect('/proxizy');
	});

	/**
	 * Error Handler.
	 */
	app.use(errorHandler());

	return app;
};
