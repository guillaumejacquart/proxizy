/**
 * GET /
 * Apps page.
 */
const App = require('../models/app');
const User = require('../models/user');

exports.index = (req, res) => {
	User.find({ admin: false }, (err, users) => {
		App.find({}, (err, apps) => {
			apps.forEach((a) => {
				if (a.users) {
					var newUsers = [];
					a.users.forEach((u) => {
						var userDb = users.filter((uDb) => uDb._id == u);
						if (!userDb.length) {
							return;
						}
						newUsers.push({ email: userDb[0].email });
					});
					a.users = newUsers;
				}
			})

			res.render('app/index', {
				title: 'Apps',
				apps: apps
			});
		});
	});
};

exports.getCreate = (req, res) => {
	User.find({ admin: false }, (err, users) => {
		res.render('app/new', {
			title: 'Apps',
			users: users
		});
	});
};

exports.postCreate = (req, res) => {
	req.assert('name', 'Name is required').notEmpty();
	req.assert('proxy', 'Proxy pass is required').notEmpty();

	const errors = req.validationErrors();

	if (errors) {
		req.flash('errors', errors);
		return res.redirect('/proxizy/apps/new');
	}

	var users = [];
	if(req.body.users){
		req.body.users.forEach((u) => {
			if (Array.isArray(u) && u.length > 1) {
				users.push(u.filter((t) => { return t !== 'on'; })[0]);
			}
		});
	}

	var app = {
		name: req.body.name,
		url: req.body.url,
		domain: req.body.domain,
		restricted: req.body.restricted === 'on',
		proxy: req.body.proxy,
		users: users
	};

	App.insert(app, (err, newApp) => {
		return res.redirect('/proxizy/apps');
	});
};

exports.getEdit = (req, res) => {
	var appId = req.params.id;
	User.find({ admin: false }, (err, users) => {
		App.findById(appId, (err, app) => {
			users.forEach((u) => {
				u.selected = app.users.indexOf(u._id) !== -1;
			});
			res.render('app/edit', {
				title: 'Apps',
				app: app,
				users: users
			});
		});
	});
};

exports.postEdit = (req, res) => {
	var appId = req.params.id;
	req.assert('name', 'Name is required').notEmpty();
	req.assert('proxy', 'Proxy pass is required').notEmpty();

	const errors = req.validationErrors();

	if (errors) {
		req.flash('errors', errors);
		return res.redirect('/proxizy/apps/edit/' + appId);
	}

	var users = [];
	if(req.body.users){
		req.body.users.forEach((u) => {
			if (Array.isArray(u) && u.length > 1) {
				users.push(u.filter((t) => { return t !== 'on'; })[0]);
			}
		});
	}

	var app = {
		name: req.body.name,
		url: req.body.url,
		domain: req.body.domain,
		restricted: req.body.restricted === 'on',
		proxy: req.body.proxy,
		users: users
	};

	App.update({ _id: appId }, app, (err, app) => {
		return res.redirect('/proxizy/apps');
	});
};

exports.remove = (req, res) => {
	var appId = req.params.id;
	App.remove({ _id: appId }, {}, (err) => {
		return res.json({
			status: 'OK',
			redirectUrl: '/proxizy/apps'
		});
	});
};
