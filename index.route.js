const express = require('express');

const router = express.Router(); // eslint-disable-line

const oauthRoute = require('./server/api/oauth/oauth.route');
const userRoute = require('./server/api/users/user.route');

router.use('/oauth', oauthRoute);
router.use('/users', userRoute);

module.exports = router;
