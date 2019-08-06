const Client = require('../../api/oauth/client.model');
const Token = require('../../api/oauth/token.model');
const Code = require('../../api/oauth/authCode.model');
const logger = require('../logger');
const _ = require('lodash');

const getAccessToken = (accessToken) => {
  logger.resource('self', `Get token ${accessToken}`);
  return Token.findOne({ accessToken });
};

const getClient = (clientId) => {
  logger.resource('self', `Get Client ${clientId}`);
  return Client.findOne({
    clientId,
  });
};

const saveToken = (token, client, user) => {
  new Token({
    ...token,
    client: client._id,
    user: user._id,
    userModel: user.id === client.id ? 'Client' : 'Auth',
  }).save();

  token.client = client.clientId; // eslint-disable-line
  token.user = user.username || user.clientId; // eslint-disable-line

  return token;
};

const saveAuthorizationCode = (code, client, user) => {
  new Code({
    code: code.authorizationCode,
    expiresAt: code.expiresAt,
    redirectUri: code.redirectUri,
    scope: code.scope,
    client: client._id,
    user: user._id,
  }).save();

  return code;
};

const validateScope = (user, client, scope) => {
  logger.resource('self', `Validate scope ${scope}`);
  const requestedScopes = scope ? scope.split(',') : null;

  // eslint-disable-next-line
  if (!scope || !_.every(requestedScopes, s => _.includes(user.scopes, s) && _.includes(client.scopes, s))) {
    return false;
  }

  return scope;
};

module.exports = {
  getClient,
  saveToken,
  getAccessToken,
  saveAuthorizationCode,
  validateScope,
  ...require('./modules/password.oauth'), // eslint-disable-line
  ...require('./modules/authorizationCode.oauth'), // eslint-disable-line
  ...require('./modules/refresh.oauth'), // eslint-disable-line
  ...require('./modules/clientCredentials.oauth'), // eslint-disable-line
  ...require('./modules/authenticate.oauth'), // eslint-disable-line
};
