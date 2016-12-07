#!/usr/bin/env node

var program = require('commander');
var dirty = require('dirty');
var colors = require('colors');
var spawn = require('child_process').spawn;
var db = dirty(__dirname + '/process.db');
var request = require('request');

program
    .parse(process.argv);

var port = program.port || 3000;

db.on('load', function () {
	var proc = db.get('process');
	
	if(proc.port){		
		request(`http://localhost:${proc.port}/status`, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(('A proxizy server is running on port ' + port).green)
			} else {
				console.log(('No proxizy server running').cyan)
			}
		})
	}
});

