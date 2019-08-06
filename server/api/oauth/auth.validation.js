const Joi = require('joi');
const AuthStatus = require('../../variables/auth-status.constant');

module.exports = {
  create: {
    body: {
      username: Joi.string().trim()
        .required()
        .min(6)
        .max(20),
      password: Joi.string().trim()
        .required()
        .min(8)
        .max(100),
      status: Joi.number().default(AuthStatus.NOT_ACTIVATED),
    },
  },
  update: {
    body: {
      password: Joi.string().trim()
        .min(8)
        .max(100),
      status: Joi.number().default(0),
    },
  },
  setScope: {
    body: {
      scope: Joi.string().trim().required(),
    },
  },
  logOut: {
    body: {
      client_id: Joi.string().trim().required(),
      accessToken: Joi.string().trim().required(),
    }
  }
};
