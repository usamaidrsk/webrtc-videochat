'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const ExpressOIDC = require('@okta/oidc-middleware').ExpressOIDC;
const session = require('express-session');

const routes = require('./routes');
const sockets = require('./socket');

const start = function (options) {
  return new Promise(function (resolve, reject) {
    process.on('unhandledRejection', (reason, p) => {
      console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    });

    if (!options.port) {
      reject(new Error('no port specified'));
    }

    const app = express();
    const http = require('http').createServer(app);
    const io = require('socket.io')(http);

    var rooms = [];
    app.set('view engine', 'pug');
    app.set('views', path.join(__dirname, ''));
    // app.use(express.static('public'));

    app.use(bodyParser.urlencoded({ extended: false }));

    app.use(function (error, request, response, next) {
      console.log(error);
      reject(new Error('something went wrong' + error));
      response.status(500).send('something went wrong');
    });

    const oidc = new ExpressOIDC({
      issuer: `https://${process.env.OKTA_BASE_URL}/oauth2/default`,
      client_id: process.env.OKTA_BASE_URL,
      client_secret: process.env.OKTA_BASE_URL,
      appBaseUrl: process.env.OKTA_BASE_URL,
      scope: 'openid profile',
      routes: {
        login: {
          path: '/users/login',
        },
        callback: {
          path: '/authorization-code/callback',
        },
        loginCallback: {
          afterCallback: '/dashboard',
        },
      },
    });

    app.use(
      session({
        secret:
          'asd;skdvmfebvoswmvlkmes";lvmsdlfbvmsbvoibvms"dplvmdmaspviresmpvmrae";vm"psdemr',
        resave: true,
        saveUninitialized: false,
      })
    );

    app.use(oidc.router);

    routes(app, { rooms: rooms });
    sockets(io, rooms);

    const server = http.listen(options.port, function () {
      resolve(server);
    });
  });
};

module.exports = Object.assign({}, { start });