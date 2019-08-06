const express = require('./modules/express.config');
const mongo = require('./modules/mongo.config');
const server = require('./modules/server.config');
const local = require('./modules/local.config');
const oauth = require('./modules/oauth.config');

module.exports = {
  express,
  mongo,
  server,
  local,
  oauth,
};
