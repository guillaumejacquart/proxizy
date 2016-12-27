var dirty = require('dirty');
var colors = require('colors');
var isRunning = require('is-running');
var spawn = require('child_process').spawn;

function startProxizy(db, port){
    var proc = db.get('process');
	
	if(proc && proc.pid && isRunning(proc.pid)){
		return console.log('Proxizy server already running and cannot be started.'.red);		
	}
	
	console.log('Starting Proxizy server in the background on the port : ' + (port.toString()).cyan + ' ...');

	var childProcess = spawn('node', [__dirname + '/www'], {
		detached: true,
		stdio:['ignore', 'ignore', 'ignore', 'ipc'],
		env: {
			PORT: port
		}
	});
	
	childProcess.on('message', function(data){
		if(data.message === 'loaded'){
			console.log('Saving process PID on key/value database ...'.cyan);
			db.set('process', { 
				pid: childProcess.pid,
				port: port
			});
			console.log('Proxizy server started successfully !'.green);
			
			console.log('You can access the admin panel on this URL : http://localhost:' + port + '/proxizy');
			
			childProcess.unref();
			process.exit();
		}
	});
}

function stopProxizy(pid, callback){
	console.log('Stoping Proxizy server ...');
	try{
		process.kill(pid);		
		console.log('Proxizy server stopped !'.green);
		return callback ? callback() : true;
	} catch(e){
		if(e.errno == 'ESRCH'){
			console.log('Proxizy server was not running... kill aborted'.yellow);
			return callback ? callback() : true;
		} else{			
			console.log('Unhandled exception occured :'.red);
			console.log(e);
			return callback ? callback(e) : true;
		}
	}
}

module.exports = {
	start: startProxizy,
	stop: stopProxizy
}