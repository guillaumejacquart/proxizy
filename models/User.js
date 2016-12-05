const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const Datastore = require('nedb');

/**
 * Load db
 */
if(typeof(userDb) === 'undefined'){	
	console.log('loading userDb...');
	userDb = new Datastore({ filename: 'data/users.db', autoload: true });
}
exports = userDb;

exports.findById = function(id, cb){
	return userDb.findOne({_id: id}, cb);
}

/**
 * Helper method for validating user's password.
 */
exports.comparePassword = function (candidatePassword, userPassword, cb) {
  bcrypt.compare(candidatePassword, userPassword, (err, isMatch) => {
    cb(err, isMatch);
  });
};

exports.save = function(user, cb){
	bcrypt.genSalt(10, (err, salt) => {
		if (err) { return callback(err); }
		bcrypt.hash(user.password, salt, null, (err, hash) => {
		  if (err) { return callback(err); }
		  user.password = hash;
		  userDb.insert(user, function(err, user){
			return cb(err, user);
	      });
		});
	});
};

exports.update = function(user, cb){
	bcrypt.genSalt(10, (err, salt) => {
		if (err) { return callback(err); }
		bcrypt.hash(user.password, salt, null, (err, hash) => {
		  if (err) { return callback(err); }
		  if(user.password && user.password.length > 0){
			user.password = hash;
		  }
		  userDb.update({ _id: user._id }, { $set: user }, function(err, userUpdated){
			return cb(err, userUpdated);
	      });
		});
	});
};

/**
 * Helper method for getting user's gravatar.
 */
exports.gravatar = function gravatar(size) {
  if (!size) {
    size = 200;
  }
  if (!this.email) {
    return `https://gravatar.com/avatar/?s=${size}&d=retro`;
  }
  const md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

module.exports = exports;