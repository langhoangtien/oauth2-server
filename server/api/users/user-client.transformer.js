const AbstractTransformer = require('d-transformer').AbstractTransformer;

class UserClientTransformer extends AbstractTransformer {
  constructor() {
    super(null);
    this.availableIncludes = ['client'];
  }

  transform([auth, client, token]) { // eslint-disable-line
    return {
      user: {
        name: auth ? auth.user.name : client.clientId,
        email: auth ? auth.user.email : null,
        code: auth.user.code,
        username: auth.username,
      },
    };
  }

  async includeClient([auth, client]) { // eslint-disable-line
    return {
      client: client.clientId,
    };
  }
}

module.exports = UserClientTransformer;
