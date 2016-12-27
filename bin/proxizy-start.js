#!/usr/bin/env node

var program = require('commander');
var utils = require('./utils.js');
var dirty = require('dirty');
var db = dirty(__dirname + '/process.db');

program
    .option('-p, --port [port]', 'Port')
    .parse(process.argv);

var port = program.port || 3000;

db.on('load', function () {
	utils.start(db, port);
});