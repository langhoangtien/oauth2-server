const Auth = require('../oauth/auth.model');
const User = require('./user.model');
const Client = require('../oauth/client.model');
const UserClientTransformer = require('./user-client.transformer');
const UserTransformer = require('./user.transformer');
const ApiError = require('../../helpers/errors/APIError');
const AuthStatus = require('../../variables/auth-status.constant');
const MongoosePaginator = require('d-transformer').MongoPaginator;
const _ = require('lodash');

const list = async (req, res, next) => {
  try {
    res.transformer.paginator(new MongoosePaginator(User), new UserTransformer());
  } catch (e) {
    next(e);
  }
};

const create = async (req, res, next) => {
  try {
    // eslint-disable-next-line
    const { username, password, name, email,  status,code} = req.body;
    const [auth, user] = await Promise.all([
      Auth.createTemporaryIfNotExists(username, password, { status }),
      User.createTemporaryIfNotExists(
        { $or: [{ email }, { code }] },
        {
          email,
          name,
          code,
          username,
        },
      ),
    ]);
    if (auth && user) {
      auth.user = user._id;
      Promise.all([auth.save(), user.save()]).then(([authSaved]) => {
        res.json(authSaved);
      }).catch((err) => {
        next(err);
      });
      // res.transformer
      //   .item(user, new UserTransformer())
      //   .withStatus(201)
      //   .dispatch();
      // res.json(res)
      // console.log(res);
    } else res.transformer.errorBadRequest('User already exists');
  } catch (e) {
    next(e);
  }
};

const me = async (req, res, next) => {
  try {
    const data = await Promise.all([
      Auth.findById(res.locals.oauth.token.user).populate('user'),
      Client.findById(res.locals.oauth.token.client),
      res.locals.oauth.token,
    ]);
    res.transformer.item(data, new UserClientTransformer()).dispatch();
  } catch (e) {
    next(e);
  }
};

const get = (req, res) => {
  res.transformer.item(req.user, new UserTransformer()).dispatch();
};

const update = async (req, res, next) => {
  try {
    const validFields = [
      'password',
      'name',
      'email',
      'mobile_number',
      'status',
      'code',
      'gender',
      'dob',
      'id_card',
      'address',
    ];

    const cleanData = _.pickBy(req.body, (value, key) => _.includes(validFields, key));

    await req.user.updateSafe(_.mapKeys(cleanData, (value, key) => _.camelCase(key)));

    if (cleanData.password || cleanData.status) await req.auth.updateSafe(cleanData);

    res.transformer.item(req.user, new UserTransformer()).dispatch();
  } catch (e) {
    next(e);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    req.auth.status = AuthStatus.DELETED; // eslint-disable-line
    await req.auth.save();
    res.transformer
      .item(req.user, new UserTransformer())
      .withStatus(202)
      .dispatch();
  } catch (e) {
    next(e);
  }
};

const setScope = (req, res) => {
  const { scope } = req.body;
  req.auth.scope = scope; // eslint-disable-line
  res.transformer
    .item(req.user, new UserTransformer())
    .withStatus(202)
    .dispatch();
};

const load = async (req, res, next, id) => {
  try {
    const user = await User.findOne({ code: id });
    if (!user) throw new ApiError('User does not exist', 404, true);
    const auth = await Auth.findOne({ user: user._id, status: { $ne: AuthStatus.DELETED } });
    if (!auth) throw new ApiError('User does not exist', 404, true);
    req.user = user; // eslint-disable-line
    req.auth = auth; // eslint-disable-line
    next();
  } catch (e) {
    next(e);
  }
};

module.exports = { create, me, get, load, deleteUser, update, list, setScope };
