const app = require('../../../config/express');
const config = require('config');
const Token = require('./token.model');
const Client = require('./client.model');
const httpStatus = require('http-status');

// eslint-disable-next-line
const authenticateHandler = (options = { allowBearerTokensInQueryString: true }) => app.oauth.authenticate(options);

// eslint-disable-next-line
const tokenHandler = (options = { requireClientAuthentication: { password: true } }) => app.oauth.token(options);

const authorizeHandler = (options = {}) => app.oauth.authorize(options);

const logOut = (req, res) => {
  const {
    accessToken,
    client_id,
  } = req.body;

  Client
    .findOne({ clientId: client_id })
    .then((client) => {
      if (!client) {
        // eslint-disable-next-line no-throw-literal
        throw {
          error: 'invalid_client',
          error_description: 'Invalid client: client credentials are invalid',
        };
      }

      return client;
    })
    .then(client => Token.findOneAndRemove({
      accessToken,
      client: client._id,
    }))
    .then((token) => {
      if (!token) {
        // eslint-disable-next-line no-throw-literal
        throw {
          error: 'invalid_token',
          error_description: 'Invalid token: token is invalid'
        };
      }

      res.status(httpStatus.OK).json({
        status: 'success',
        data: null,
      });
    })
    .catch((e) => {
      switch (e.error) {
        case 'invalid_client':
          res.status(httpStatus.BAD_REQUEST).json(e);
          break;
        case 'invalid_token':
          res.status(httpStatus.BAD_REQUEST).json(e);
          break;
        default:
          res.status(httpStatus.INTERNAL_SERVER_ERROR).json(e);
      }
    });
};

const refreshTokenForHost = (req, res, next) => {
  if (req.body.client_id === config.get('oauth.clientId')) {
    req.body.client_secret = config.get('oauth.clientSecret'); // eslint-disable-line
  }
  next();
};

module.exports = {
  authenticateHandler,
  tokenHandler,
  authorizeHandler,
  logOut,
  refreshTokenForHost };
