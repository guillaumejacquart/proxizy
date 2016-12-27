#!/usr/bin/env node

var program = require('commander');
var dirty = require('dirty');
var colors = require('colors');
var spawn = require('child_process').spawn;
var db = dirty(__dirname + '/process.db');
var request = require('request');

program
    .parse(process.argv);

db.on('load', function () {
	var proc = db.get('process');
	
	if(proc && proc.port){
		request(`http://localhost:${proc.port}/status`, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log((`A proxizy server is running on port ${proc.port} with the pid ${proc.pid}`).green)
			} else {
				console.log('No proxizy server running'.cyan)
			}
		})
	} else {
		console.log('No proxizy server running'.cyan)
	}
});

