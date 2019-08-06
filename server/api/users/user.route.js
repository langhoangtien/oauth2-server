const router = require('express').Router(); // eslint-disable-line

const userCtrl = require('./user.controller');
const authCtrl = require('../oauth/oauth.controller');

const validate = require('express-validation');
const authValid = require('../oauth/auth.validation');
const usrValid = require('./user.validation');

// router.post('/register', validate(authValid.create), validate(usrValid.create), userCtrl.create);

router.post('/create', userCtrl.create);

router.get('/', authCtrl.authenticateHandler(), userCtrl.list);

router.get('/me', authCtrl.authenticateHandler(), userCtrl.me);

router
  .route('/:userId')
  .get(authCtrl.authenticateHandler(), userCtrl.get)

  // eslint-disable-next-line
  .patch(authCtrl.authenticateHandler(), validate(authValid.update), validate(usrValid.update), userCtrl.update)

  .delete(authCtrl.authenticateHandler(), userCtrl.deleteUser);

router.patch(
  '/:userId/scope',
  authCtrl.authenticateHandler({ scope: 'admin' }),
  validate(authValid.setScope),
  userCtrl.setScope,
);

const concatenateEvents = (...events) => (req, res, next, args) => {
  let evLen = 0;
  const localNext = (err) => {
    if (err) return next(err);

    return events[++evLen](req, res, evLen === events.length - 1 ? next : this, args); // eslint-disable-line
  };
  events[0](req, res, localNext, args);
};
router.param('userId', concatenateEvents(authCtrl.authenticateHandler({ scope: 'user' }), userCtrl.load));

module.exports = router;
