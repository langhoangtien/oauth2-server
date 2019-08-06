class AbstractEncryptingStrategy {
  async encrypt(key) { // eslint-disable-line
    throw Error('Unimplemented encrypting strategy');
  }

  async isEqual(testKey) { // eslint-disable-line
    throw Error('Unimplemented encrypting strategy');
  }
}

module.exports = AbstractEncryptingStrategy;
