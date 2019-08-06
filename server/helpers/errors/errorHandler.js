const app = require('../../../config/express');
const expressValidation = require('express-validation');
const httpStatus = require('http-status/lib/index');
const config = require('config');

const APIError = require('./APIError');

app.use((err, req, res, next) => {
  if (err instanceof expressValidation.ValidationError) {
    // validation error contains errors which is an array of error each containing message[]
    const unifiedErrorMessage = err.errors.map(error => error.messages.join('. ')).join(' and ');
    const error = new APIError(unifiedErrorMessage, err.status, true);
    return next(error);
  } else if (!(err instanceof APIError)) {
    const apiError = new APIError(err.message, err.status, err.isPublic);
    return next(apiError);
  }
  return next(err);
});

app.use((req, res, next) => {
  const err = new APIError('API not found', httpStatus.NOT_FOUND);
  return next(err);
});

app.use((
  err,
  req,
  res,
  next, // eslint-disable-line no-unused-vars
) =>
  res.status(err.status).json({
    message: err.isPublic ? err.message : httpStatus[err.status],
    stack: config.get('local.env') === 'development' ? err.stack : {},
  }),
);

module.exports = app;
