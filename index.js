global.Promise = require('bluebird');

const app = require('./config/express');
const db = require('./config/mongoose');

const config = require('config');

db.connect();

require('./seeds');

/*
 *  Middlewares register
 *
 */
const transformer = require('d-transformer').middleware;

app.use(transformer);

app.use('/', require('./index.route'));

require('./server/helpers/errors/errorHandler');

if (!module.parent) {
    // listen on port config.port
  const port = config.get('local.port');
  app.listen(port, () => {
    console.info(`server started on port ${port} (${config.get('local.env')})`); // eslint-disable-line no-console
  });
}

module.exports = app;
