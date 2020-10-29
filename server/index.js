'use strict'

require('dotenv');

const server = require('./server')

const port = process.env.APP_BASE_PORT;
// const port = 8080;

server.start({
    port: port
}).then(app => {
    console.log('Application is now running on port ' + port);
})