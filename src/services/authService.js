const jwt = require('jsonwebtoken');
const config = require('../config');

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
};
