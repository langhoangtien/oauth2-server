const AbstractEncryptingStrategy = require('./abstractEncryptingStrategy');
const bcrypt = require('bcrypt');

class BCryptEncryptingStrategy extends AbstractEncryptingStrategy {
  async encrypt(key, salt = null, saltRounds = 10) { // eslint-disable-line
    if (!salt) salt = await bcrypt.genSalt(saltRounds); // eslint-disable-line
    return await bcrypt.hash(key, salt);
  }

  async isEqual(testKey, validHash) { // eslint-disable-line
    return await bcrypt.compare(testKey, validHash);
  }
}

module.exports = BCryptEncryptingStrategy;
