const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  clientId: String,
  clientSecret: String,
  grants: [String],
  redirectUris: [String],
  scopes: [String],
});

clientSchema.virtual('id').get(function () {
  return this.clientId;
});

module.exports = mongoose.model('Client', clientSchema);
