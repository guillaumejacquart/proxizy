#!/usr/bin/env node

/**
 * Module dependencies.
 */

var program = require('commander');

program
    .version(require(__dirname + '/../package.json').version)
    .command('start', 'Start proxy')
    .command('stop', 'Stop proxy')
    .command('status', 'Get running proxy infos')
    .parse(process.argv);
