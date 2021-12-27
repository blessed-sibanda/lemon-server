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
  findUsers: async (params) => {
    let sortArr = User.normalizedSortFields(params['sort']);
    let filter = params['filter'];

    let paginationOptions = {
      offset: params['skip'] || 0,
      limit: params['limit'] || 10,
      select: 'name email role _id',
    };

    if (sortArr.length != 0) {
      if (!filter)
        return await User.paginate({}, { sort: sortArr, ...paginationOptions });
      else
        return await User.paginate(
          { $text: { $search: filter } },
          { sort: sortArr, ...paginationOptions },
        );
    } else {
      if (filter)
        return await User.paginate(
          { $text: { $search: filter } },
          { sort: '-createdAt', ...paginationOptions },
        );
      else
        return await User.paginate(
          {},
          {
            sort: '-createdAt',
            ...paginationOptions,
          },
        );
    }
  },
};
