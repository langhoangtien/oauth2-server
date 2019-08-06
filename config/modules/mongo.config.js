const Joi = require('joi');

const envVarsSchema = Joi.object({
  MONGO_AUTH: Joi.boolean().default(false),
  MONGO_HOST: Joi.string().default('localhost'),
  MONGO_PORT: Joi.number().default(27017),
  MONGO_USER: Joi.string().default('root'),
  MONGO_PASSWORD: Joi.string().default('secret'),
  MONGO_DB: Joi.string().default('test'),
  MONGO_DB_USER: Joi.string()
    .allow('')
    .optional()
    .default(null),
  MONGO_DB_PASSWORD: Joi.string()
    .allow('')
    .optional()
    .default(null),
})
  .unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) throw new Error(`Config validation error: ${error.message}`);

const config = {
  auth: {
    activate: envVars.MONGO_AUTH,
    username: envVars.MONGO_USER,
    password: envVars.MONGO_PASSWORD,
  },
  host: envVars.MONGO_HOST,
  port: envVars.MONGO_PORT,
  database: {
    default: envVars.MONGO_DB,
  },
  databaseAuth: {
    username: envVars.MONGO_DB_USER,
    password: envVars.MONGO_DB_PASSWORD,
  },
};

module.exports = config;
