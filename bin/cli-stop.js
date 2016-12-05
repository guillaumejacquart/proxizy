#!/usr/bin/env node

var program = require('commander');
var dirty = require('dirty');
var colors = require('colors');
var spawn = require('child_process').spawn;
var db = dirty(__dirname + '/process.db');
var childProcess;

program
    .parse(process.argv);

console.log('Stoping Proxizy server ...');
db.on('load', function () {
    var pid = db.get('process').pid;
    process.kill(pid);
    console.log('Proxizy server stopped !'.red);
});

