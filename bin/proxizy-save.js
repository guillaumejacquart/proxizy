#!/usr/bin/env node

var program = require('commander');
var colors = require('colors');
var fs = require('fs-extra');
var spawn = require('child_process').spawn;
var dirty = require('dirty');
var db = dirty(__dirname + '/process.db');
var childProcess;

program
    .parse(process.argv);

console.log('Saving proxizy configuration ...');
db.on('load', function () {
    var proxizyProc = db.get('process');
	
	if(!proxizyProc){	
		return console.log('No Proxizy server instance started !'.red)
	}
	
	var dataDir = __dirname + '/../data';
	var backupDir = getUserHome() + '/.proxizy/backup';
	
	fs.mkdirs(backupDir, function (err) {
		if (err) return console.error(err)
		fs.copy(dataDir, backupDir, function (err) {
			if (err) return console.error(err)
			console.log('Proxizy configuration saved successfully!'.green)
		});
	});
});

function getUserHome() {
  return process.env.HOME || process.env.USERPROFILE;
}

