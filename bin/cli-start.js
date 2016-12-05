#!/usr/bin/env node

var program = require('commander');
var dirty = require('dirty');
var colors = require('colors');
var spawn = require('child_process').spawn;
var db = dirty(__dirname + '/process.db');
var childProcess;

program
    .option('-p, --port [port]', 'Port')
    .parse(process.argv);

var port = program.port || 3000;
console.log('Starting Proxizy server on the background on the port : ' + (port.toString()).cyan + ' ...');
childProcess = spawn('node', ['app.js'], {
    stdio: 'ignore',
    detached: true,
    env: {
        PORT: port
    }
});

db.on('load', function () {
    console.log('Saving process PID on key/value database ...'.cyan);
    db.set('process', { pid: childProcess.pid });

    console.log('Proxizy server started succesfully !'.green);
    
    console.log('You can access the admin panel on this URL : http://localhost:' + port + '/admin');
    childProcess.unref();
    return;
});

