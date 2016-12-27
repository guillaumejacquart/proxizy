# Proxizy
Proxizy is a reverse proxy with built-in embedded authentication.

### Getting started

You can use Proxizy in two ways : using the cli from the global package, or by cloning this repo and running the local environment.

#### Using the CLI
Install the proxizy server global nodejs package
```sh
$ npm install -g proxizy
```

Start the Proxizy server on a custom port (default is 3000)

```sh
$ proxizy start --port
```

```
Starting Proxizy server on the background on the port : 3000 ...
Saving process PID on key/value database ...
Proxizy server started successfully !
You can access the admin panel on this URL : http://localhost:3000/proxizy
```

Go to http://server-ip:PORT/proxizy to access proxizy Web GUI

#### Cloning the repository
Just clone the repository, install dependencies and run.
```sh
$ git clone https://github.com/guillaumejacquart/proxizy
$ cd proxizy
$ npm install
$ node app.js
```

### Command line

#### Starting the server
Start the Proxizy server on a custom port (default is 3000)

```sh
$ proxizy start --port <PORT>
```

#### Status of the server
Return the current servers status (running or not)

```sh
$ proxizy status
```

#### Stoping the server
Stopping the server if it is running

```sh
$ proxizy stop
```

#### Backup the data
Saves the apps and users in the user home path (~/.proxizy) to restore it eventually.

```sh
$ proxizy save
```

#### Restore the data
Restore the apps and users previously saved in the app database.
*The server needs to be restarted*

```sh
$ proxizy restore
```
