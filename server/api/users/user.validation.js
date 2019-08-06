const Joi = require('joi');

const phoneRegex = /^\+?\d{1,3}?[- .]?\(?(?:\d{2,3})\)?[- .]?\d\d\d[- .]?\d\d\d\d$/;

module.exports = {
  create: {
    body: {
      name: Joi.string().trim()
        .required()
        .min(5)
        .max(30),
      email: Joi.string().trim()
        .email()
        .required(),
      status: Joi.number()
        .integer()
        .min(0)
        .max(3)
        .required(),
      mobile_number: Joi.string().trim().regex(phoneRegex),
      code: Joi.string().trim().min(5).required(),
      gender: Joi.string().trim().allow(['male', 'female', 'unknown']),
      dob: Joi.date().max('now'),
      id_card: Joi.string().trim().required(),
      address: Joi.string().trim(),
      note: Joi.string().trim(),
    },
  },
  update: {
    body: {
      name: Joi.string().trim()
        .min(5)
        .max(30),
      email: Joi.string().trim().email(),
      status: Joi.number()
        .integer()
        .min(0)
        .max(3),
      mobile_number: Joi.string().trim().regex(/((09|03|07|08|05)+([0-9]{8})\b)/),
      code: Joi.string().trim(),
      gender: Joi.string().trim().allow(['male', 'female', 'unknown']),
      dob: Joi.date().max('now'),
      id_card: Joi.string().trim(),
      address: Joi.string().trim(),
      note: Joi.string().trim(),
    },
  },
};
