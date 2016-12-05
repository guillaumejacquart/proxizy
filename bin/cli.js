#!/usr/bin/env node

/**
 * Module dependencies.
 */

var program = require('commander');

program
    .version('0.0.1')
    .command('start', 'Start proxy')
    .command('stop', 'Stop proxy')
    .parse(process.argv);
