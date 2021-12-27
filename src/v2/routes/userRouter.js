const { Router } = require('express');
const merge = require('lodash/merge');
const { formatError } = require('../../helpers/dbErrorHandler');
const { userById } = require('../../services/userService');
const User = require('../../models/user');
const {
  requireAuth,
  isProfileOwnerOrManager,
  isManager,
} = require('../../services/authService');

const router = Router();

router.get('/', async (req, res) => {
  let users = await User.find().sort('-createdAt');
  res.json(users);
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

router.put('/:userId', requireAuth, isManager, async (req, res) => {
  try {
    delete req.body._id;
    delete req.body.hashedPassword;
    delete req.body.salt;

    let user = merge(req.profile, req.body);
    user = await user.save();
    res.json(user);
  } catch (err) {
    res.status(400).json(formatError(err));
  }
});

module.exports = router;
