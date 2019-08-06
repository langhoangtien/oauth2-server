const _ = require('lodash');
const logger = require('../../logger');

const verifyScope = (accessToken, scope) => {
  logger.resource('self', `Verify scope ${scope} of token ${accessToken}`);
  return _.every(scope.split(','), s => _.includes(accessToken.scope.split(','), s));
};

module.exports = {
  verifyScope,
};
