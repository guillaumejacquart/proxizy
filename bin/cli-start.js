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

db.on('load', function () {
	childProcess = spawn('node', [__dirname + '/www'], {
		detached: true,
		stdio:['pipe', 'pipe', 'pipe', 'ipc'],
		env: {
			PORT: port
		}
	});

	childProcess.stdout.on('data', (data) => {
	    console.log(`proxy : ${data}`);
	});

	childProcess.stderr.on('data', (data) => {
	  console.log(`proxy : ${data}`);
	});

	childProcess.on('close', (code) => {
	  console.log(`child process exited with code ${code}`);
	});
	
	childProcess.on('message', function(data){
		if(data.message === 'loaded'){
			console.log('Saving process PID on key/value database ...'.cyan);
			db.set('process', { pid: childProcess.pid });
			console.log('Proxizy server started succesfully !'.green);
			
			console.log('You can access the admin panel on this URL : http://localhost:' + port + '/admin');
			
			childProcess.unref();
			process.exit();
		}
	});
});

