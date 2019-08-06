const mongoose = require('mongoose');

const authCodeSchema = new mongoose.Schema({
  code: String,
  expiresAt: Date,
  redirectUri: String,
  scope: String,
  client: {
    type: mongoose.Schema.ObjectId,
    ref: 'Client',
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'Auth',
  },
});

module.exports = mongoose.model('AuthCode', authCodeSchema);
