const router = require('express').Router(); // eslint-disable-line
const oauthCtrl = require('./oauth.controller');
const validate = require('express-validation');
const authValid = require('./auth.validation');

router.all('/token', oauthCtrl.refreshTokenForHost, oauthCtrl.tokenHandler());

router.all('/authorize', oauthCtrl.authorizeHandler());

router.post('/invalidate', oauthCtrl.authenticateHandler(), validate(authValid.logOut), oauthCtrl.logOut);

module.exports = router;
