#!/usr/bin/env node

var program = require('commander');
var utils = require('./utils.js');
var dirty = require('dirty');
var db = dirty(__dirname + '/process.db');

program
    .parse(process.argv);
	

db.on('load', function () {
	var proc = db.get('process');
	
	if(!proc){	
		return console.log('No Proxizy server instance started !'.red)
	}
	
	utils.stop(proc.pid);
});


