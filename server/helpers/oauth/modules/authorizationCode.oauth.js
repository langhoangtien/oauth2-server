const Code = require('../../../api/oauth/authCode.model');
const logger = require('../../logger');

const getAuthorizationCode = (authorizationCode) => {
  logger.resource('self', `Get Code ${authorizationCode}`);
  return Code.findOne({ code: authorizationCode }).populate('client user');
};

const revokeAuthorizationCode = (authorizationCode) => {
  logger.resource('self', `Delete Code ${authorizationCode}`);
  return Code.deleteOne({ code: authorizationCode.code }).then(code => !!code);
};

module.exports = {
  getAuthorizationCode,
  revokeAuthorizationCode,
};
