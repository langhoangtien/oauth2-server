const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  accessToken: String,
  accessTokenExpiresAt: Date,
  refreshToken: String,
  refreshTokenExpiresAt: {
    type: Date,
    default: Date.now,
    index: {
      expires: '14 days'
    }
  },
  client: {
    type: mongoose.Schema.ObjectId,
    ref: 'Client',
  },
  user: {
    type: mongoose.Schema.ObjectId,
    refPath: 'userModel',
  },
  userModel: {
    type: String,
    required: true,
    enum: ['Auth', 'Client'],
  },
  scope: {
    type: String,
  },
});

module.exports = mongoose.model('Token', tokenSchema);
