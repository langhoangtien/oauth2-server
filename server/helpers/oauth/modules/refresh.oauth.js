const Token = require('../../../api/oauth/token.model');
const logger = require('../../logger');

const getRefreshToken = (refreshToken) => {
  logger.resource('self', `Get Token ${refreshToken}`);
  return Token.findOne({ refreshToken }).populate('client user');
};

const revokeToken = (token) => {
  logger.resource('self', `Delete ${token}`);
  return Token.deleteOne({ accessToken: token.accessToken }).then(t => !!t);
};

module.exports = {
  getRefreshToken,
  revokeToken,
};
