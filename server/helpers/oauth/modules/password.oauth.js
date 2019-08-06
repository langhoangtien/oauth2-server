const Auth = require('../../../api/oauth/auth.model');

const getUser = (username, password) => Auth.assertAuth(username, password, true);

module.exports = {
  getUser,
};
