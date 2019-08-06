const express = require('express');

const app = express();
const compress = require('compression');
const helmet = require('helmet');
const cors = require('cors');

require('dotenv').config();

const morgan = require('morgan');
const bodyParser = require('body-parser');
const OAuthServer = require('express-oauth-server');

app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const model = require('../server/helpers/oauth/model');

app.oauth = new OAuthServer({
  model,
});

app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(compress());

app.use(helmet());

app.use(cors());

module.exports = app;
