const { Router } = require('express');
const merge = require('lodash/merge');
const { formatError } = require('../../helpers/dbErrorHandler');
const { userById, findUsers } = require('../../services/userService');
const User = require('../../models/user');
const {
  requireAuth,
  isProfileOwnerOrManager,
  isManager,
} = require('../../services/authService');
require('mongoose-paginate-v2');
var debug = require('debug')('lemon-server:userRouter');

const router = Router();

router.get('/', async (req, res) => {
  try {
    let result = await findUsers(req.query);
    res.json({
      data: result.docs,
      total: result.totalDocs,
    });
  } catch (err) {
    res.status(err.statusCode || 400).json(formatError(err));
  }
});

router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (err) {
    res.status(400).json(formatError(err));
  }
});

router.param('userId', userById);

router.get('/:userId', requireAuth, isProfileOwnerOrManager, async (req, res) => {
  res.json(req.profile);
});

router.put('/:userId', requireAuth, isProfileOwnerOrManager, async (req, res) => {
  try {
    delete req.body._id;
    delete req.body.hashedPassword;
    delete req.body.salt;

    if (req.body.email && req.body.email.trim() === req.profile.email)
      delete req.body.email;

    let user = merge(req.profile, req.body);
    user = await user.save();
    res.json(user);
  } catch (err) {
    res.status(400).json(formatError(err));
  }
});

module.exports = router;
