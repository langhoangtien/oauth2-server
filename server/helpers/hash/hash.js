const BCryptStrategy = require('./bcryptEncryptingStrategy');
const AbstractStrategy = require('./abstractEncryptingStrategy');

let hashInstance = null;

class Hash {
  constructor() {
    if (hashInstance) return hashInstance;

    this.hashEngines = new Map([['default', new BCryptStrategy()]]);

    hashInstance = this;
  }

  async make(key, engine = 'default', ...rest) {
    if (!engine) engine = 'default'; // eslint-disable-line

    const theEngine = this.getEngine(engine);

    return await theEngine.encrypt(key, ...rest);
  }

  async compare(key, engine = 'default', ...rest) {
    if (!engine) engine = 'default'; // eslint-disable-line

    const theEngine = this.getEngine(engine);

    return await theEngine.isEqual(key, ...rest);
  }

  registerHashEngine(name, engine) {
    if (!(engine instanceof AbstractStrategy)) throw Error('Hash engine must extends AbstractStrategy');

    if (this.hashEngines.has(name)) throw Error('Duplicate engine name');

    this.hashEngines.set(name, engine);
  }

  registerAlias(alias, name) {
    if (typeof alias !== 'string' || typeof name !== 'string') { throw Error('Invalid alias/name type. Required to be string.'); }

    if (this.hashEngines.has(alias)) throw Error('Duplicate alias name.');

    if (!this.hashEngines.has(name)) throw Error('Engine name not found.');

    this.hashEngines.set(alias, name);
  }

  getEngine(name) {
    if (!this.hashEngines.has(name)) throw Error('Engine name not found.');

    const result = this.hashEngines.get(name);

    if (typeof result === 'string') {
      return this.getEngine(result);
    } return result;
  }

  removeEngine(name) {
    if (!this.hashEngines.has(name)) throw Error('Undefined Hash Engine');

    this.hashEngines.delete(name);
  }
}

module.exports = new Hash();
