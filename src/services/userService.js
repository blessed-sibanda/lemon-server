const User = require('../models/user');

module.exports = {
  userById: async (req, res, next, id) => {
    let user = await User.findById(id);
    if (!user)
      return res.status(404).json({
        error: 'User not found',
      });
    req.profile = user;
    next();
  },
};
