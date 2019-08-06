const mongoose = require('mongoose');
const ApiError = require('../../helpers/errors/APIError');
const _ = require('lodash');

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    index: {
      unique: true,
    },
  },
  scopes: {
    type: String,
    default: 'user',
  },
  code: {
    required: true,
    type: String,
  },
  username: String,
});

userSchema.statics = {
  async createTemporaryIfNotExists(query, data) {
    const user = await this.model('User').findOne(query);

    if (user) throw new ApiError('Account already exists', 400, true);

    return this.model('User', userSchema)(data);
  },
};

userSchema.methods = {
  async updateSafe(data) {
    const validFields = ['name', 'email', 'mobileNumber', 'code', 'gender', 'dob', 'idCard', 'address'];
    const [userByEmail, userByCode] = await Promise.all([
      data.email ? this.model('User').findOne({ email: data.email }) : null,
      data.code ? this.model('User').findOne({ code: data.code }) : null,
    ]);
    if (userByEmail) throw new ApiError('Email duplicated', 400, true);
    if (userByCode) throw new ApiError('Code duplicated', 400, true);

    const cleanData = _.pickBy(data, (value, key) => _.includes(validFields, key));

    _.forEach(cleanData, (value, key) => {
      this.set(key, value);
    });

    await this.save();
  },
};

module.exports = mongoose.model('User', userSchema);
