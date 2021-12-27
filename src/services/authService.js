const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const config = require('../config');
var debug = require('debug')('lemon-server:auth-server');

module.exports = {
  createJwt: (user) => {
    const payload = {
      email: user.email,
      role: user.role,
      picture: user.picture,
    };
    const accessToken = jwt.sign(payload, config.jwtSecret, {
      subject: user._id.toString(),
      expiresIn: '1d',
    });
    return accessToken;
  },
  requireAuth: expressJwt({
    secret: config.jwtSecret,
    userProperty: 'auth',
    algorithms: ['HS256'],
  }),
  isProfileOwnerOrManager: async (req, res, next) => {
    const authorized =
      req.profile &&
      req.auth &&
      (req.profile._id == req.auth.sub || req.auth.role == 'manager');
    if (!authorized)
      return res.status(403).json({
        error: 'Only manager or profile owner is authorized',
      });
    next();
  },
  isManager: async (req, res, next) => {
    const authorized = req.auth && req.auth.role == 'manager';
    if (!authorized)
      return res.status(403).json({
        error: 'Only manager is authorized',
      });
    next();
  },
};
