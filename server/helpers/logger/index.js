const config = require('config');
const logger = require('./extremeLogger')(config.get('local.env') !== 'development');
const _ = require('lodash');

const CENSOR_FIELDS = ['password'];

module.exports = {
  debug(message, isPublic = false) {
    let msg = message;
    if (isPublic && typeof message === 'object') { msg = _.pickBy(msg, (value, field) => _.includes(CENSOR_FIELDS, field)); }
    logger.debug(msg);
  },
  info(message) {
    if (typeof message === 'object') logger.info(_.pickBy(message, (value, field) => _.includes(CENSOR_FIELDS, field)));
    else logger.info(message);
  },
  error(err) {
    logger.error(err);
  },
  fatal(extremeErr) {
    logger.fatal(extremeErr);
  },
  resource(to, message) {
    logger.info({ to }, message);
  },
};

module.exports.logger = logger;
