const mongoose = require('mongoose');
const config = require('config');
const logger = require('../server/helpers/logger');

/**
 * Get the mongo uri of the provided database (default database in config
 * file) with configuration from mongo config.
 *
 * @param database
 * @returns {string}
 */
const resolveMongoUrl = (database = null) => {
  let result = 'mongodb://@{AUTH}@{HOST}@{PORT}/@{DB}';
  if (config.has('mongo.databaseAuth.username') && config.has('mongo.databaseAuth.password')) {
    const username = config.get('mongo.databaseAuth.username');
    const password = config.get('mongo.databaseAuth.password');
    result = result.replace('@{AUTH}', `${username}:${password}@`);
  } else result = result.replace('@{AUTH}', '');

  result = result.replace('@{HOST}', config.get('mongo.host') || 'localhost');

  result = result.replace('@{PORT}', `:${config.get('mongo.port') || 27017}`);

  const dbPath = database ? `mongo.database.${database}` : 'mongo.database.default';

  result = result.replace('@{DB}', config.get(dbPath));

  return result;
};

// On Error listener
const onError = (reason) => {
  logger.error(reason);
};

//  Change mongoose Promise type
mongoose.Promise = require('bluebird');

module.exports.connect = () => {
  const auth = config.get('mongo.auth.activate')
    ? {
      auth: { authSource: 'admin' },
      user: config.get('mongo.auth.username'),
      pass: config.get('mongo.auth.password'),
    } : {};

  mongoose
    .connect(resolveMongoUrl(), {
      autoIndex: true,
      useNewUrlParser: true,
      keepAlive: true,
      useFindAndModify: false,
      useCreateIndex: true,
      ...auth,
    })
    .catch(reason => onError(reason));
  return mongoose.connection;
};
