const Client = require('../../../api/oauth/client.model');
const logger = require('../../logger');

const getUserFromClient = (client) => {
  logger.resource('self', `Get Client ${client.clientId}`);
  return Client.findOne({
    clientId: client.clientId,
    clientSecret: client.clientSecret,
    grants: 'client_credentials',
  });
};

module.exports = {
  getUserFromClient,
};
