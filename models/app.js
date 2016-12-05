const Datastore = require('nedb');

/**
 * Load db
 */
if(typeof(appDb) === 'undefined'){
	console.log('loading appDb...');
	appDb = new Datastore({ filename: 'data/apps.db', autoload: true });
	exports = appDb;
}

exports = appDb;

exports.findById = function(id, cb){
	return appDb.findOne({_id: id}, cb);
}

exports.save = function(app, cb){
  return appDb.insert;
};

module.exports = exports;