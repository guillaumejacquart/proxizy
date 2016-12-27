#!/usr/bin/env node

var program = require('commander');
var dirty = require('dirty');
var colors = require('colors');
var fs = require('fs-extra');
var spawn = require('child_process').spawn;
var db = dirty(__dirname + '/process.db');
var isRunning = require('is-running');
var utils = require('./utils.js');
var childProcess;

program
    .parse(process.argv);

console.log('Resurrecting proxizy configuration ...');
db.on('load', function () {
	var dataDir = __dirname + '/../data';
	var backupDir = getUserHome() + '/.proxizy/backup';		
	var proxizyRunning = false;
	
    var proxizyProc = db.get('process');
	
	if(proxizyProc){	
		var pid = proxizyProc.pid;	
		var port = proxizyProc.port || 3000;
		proxizyRunning = isRunning(pid);
	}
	
	fs.open(backupDir,'r',function(err,fd){
		if (err && err.code=='ENOENT') { 
			return console.log('No backup found for proxizy configuration.'.red);			
		}
		
		if(err){
			return console.log(err.red);
		}
	
		// Stops proxizy if running
		if(proxizyRunning){	
			utils.stop(pid, function(){
				restoreBackup(dataDir, backupDir, () => restartServer(proxizyRunning, port));
			});
		} else {
			restoreBackup(dataDir, backupDir, () => restartServer(proxizyRunning, port));
		}	
	});
});

function getUserHome() {
	return process.env.HOME || process.env.USERPROFILE;
}

function restoreBackup(dataDir, backupDir, callback){		
	// Copy backup data dir to module data dir
	fs.mkdirs(dataDir, function (err) {
		if (err) return console.error(err)
		fs.copy(backupDir, dataDir, function (err) {
			if (err) return console.error(err)
			console.log('Proxizy configuration restored successfully!'.green);
			callback();
		});
	});
}

function restartServer(proxizyRunning, port){	

	// Restarts proxizy if it was running before resurrect
	if(proxizyRunning){
		console.log('Restarting Proxizy server...'.yellow);	
		utils.start(db, port);
	}
}
