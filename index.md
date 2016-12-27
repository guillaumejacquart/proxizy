# Proxizy
Proxizy is a reverse proxy with built-in embedded authentication.

### Installation

You can use Proxizy in two ways : using the cli from the global package, or by cloning this repo and running the local environment.

### Using the CLI
Install the proxizy server global nodejs package
```sh
$ npm install -g proxizy
```

Start the Proxizy server on a custom port
```sh
$ proxizy start --port <PORT>
```
Go to http://server-ip:PORT/admin to access proxizy Web GUI

### Cloning the repository
Just clone the repository, install dependencies and run.
```sh
$ git clone https://github.com/guillaumejacquart/proxizy
$ cd proxizy
$ npm install
$ node app.js
```
