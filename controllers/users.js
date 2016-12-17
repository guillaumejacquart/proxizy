/**
 * GET /
 * Apps page.
 */
const App = require('../models/app');
const User = require('../models/user');

exports.index = (req, res) => {
  User.find({}, (err, users) => {	  
	  res.render('users/index', {
		title: 'Users',
		users: users
	  });
  });
};

exports.getCreate = (req, res) => {
    res.render('users/new', {
	  title: 'Users'
    });
};

exports.postCreate = (req, res) => {
  req.assert('email', 'Email is required').notEmpty();
  req.assert('password', 'Password is required').notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/admin/users/new');
  }
  
  var user = {
	  email: req.body.email,
	  password: req.body.password,
	  admin: typeof(req.body.admin) !== 'undefined' && req.body.admin === 'on' ? true : false
  };
  
  User.save(user, (err, newUser) => {
    return res.redirect('/admin/users');	  
  });
};

exports.getEdit = (req, res) => {
    var userId = req.params.id;
    User.findById(userId, (err, user) => {
      res.render('users/edit', {
	    title: 'Users',
		user: user
      });
    });
};

exports.postEdit = (req, res) => {
  var userId = req.params.id;
  req.assert('email', 'Email is required').notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/admin/users/edit/' + userId);
  }
  
  var user = {
	  email: req.body.email,
	  password: req.body.password,
	  admin: typeof(req.body.admin) !== 'undefined' && req.body.admin === 'on' ? true : false
  };
  
  User.updateUser(userId, user, (err, userDb) => {
    return res.redirect('/admin/users');	  
  });
};

exports.remove = (req, res) => {
	var userId = req.params.id;
	console.log(userId);
	User.remove({ _id: userId, admin: false }, {}, (err, nummRemoved) => {
		console.log(nummRemoved);
		return res.json({
			status: 'OK',
			redirectUrl: '/admin/users'
		});
	});
};
