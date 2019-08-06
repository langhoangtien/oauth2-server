const mongoose = require('mongoose');
const hash = require('../../helpers/hash/hash');
const ApiError = require('../../helpers/errors/APIError');
const _ = require('lodash');

const authSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    index: {
      unique: true,
    },
    minlength: [6, 'length of username must greater than 6'],
    maxlength: [20, 'length of username must less than 20'],
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'length of password must greater than 8'],
    maxlength: [100, 'length of password must less than 100'],
  },
  status: {
    type: Number,
    enum: [0, 1, 2, 3], // 0: not activated, 1: activated, 2: locked, 3: deleted
    default: 0,
  },
  scopes: {
    type: [String],
    default: ['user'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
});

authSchema.pre('save', async function (next) {
  try {
    if (this.isModified('password')) {
      this.password = await hash.make(this.password);
      next();
    }
    next();
  } catch (e) {
    next(e);
  }
});

authSchema.virtual('id').get(function () {
  return this.username;
});

authSchema.methods = {
  validatePassword(assertingPassword) {
    return hash.compare(assertingPassword, null, this.password);
  },

  async updateSafe(data) {
    const validFields = ['password', 'status'];

    const cleanData = _.pickBy(data, (value, key) => _.includes(validFields, key));

    _.forEach(cleanData, (value, key) => {
      this[key] = value;
    });

    this.save();
  },

  delete() {
    return this.model('Auth').deleteOne({ _id: this._id });
  },
};

authSchema.statics = {
  async createTemporaryIfNotExists(username, password, data) {
    const auth = await this.model('Auth').findOne({ username });
    if (auth) throw new ApiError('Account already exists', 400, true);

    return this.model('Auth', authSchema)({ username, password, ...data });
  },

  async assertAuth(username, password, populate = true) {
    const auth = populate
      ? await this.model('Auth')
          .findOne({ username })
          .populate('user')
      : await this.model('Auth').findOne({ username });

    if (!auth) return false;

    return await auth.validatePassword(password) ? auth : null;
  },
};

module.exports = mongoose.model('Auth', authSchema);
