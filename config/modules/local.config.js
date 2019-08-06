const Joi = require('joi');

const envVarsSchema = Joi.object({
  PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string().allow(['development', 'test', 'production', 'provision']),
})
  .unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) throw new Error(`Config validation error: ${error.message}`);

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
};

module.exports = config;
