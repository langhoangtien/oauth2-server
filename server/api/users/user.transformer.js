const AbstractTransformer = require('d-transformer').AbstractTransformer;
const Auth = require('../oauth/auth.model');

class UserTransformer extends AbstractTransformer {
  constructor() {
    super(null);
    this.availableIncludes = ['auth'];
  }

  transform(user) { // eslint-disable-line
    return {
      code: user.code,
      name: user.name,
      email: user.email,
      phone: user.mobileNumber,
      username: user.username,
      status: user.status,
    };
  }

  async includeAuth(user) { // eslint-disable-line
    const { username, scope } = await Auth.findOne({ user: user._id });
    return {
      username,
      scope,
    };
  }
}

module.exports = UserTransformer;
