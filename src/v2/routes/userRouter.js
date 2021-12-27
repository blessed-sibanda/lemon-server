const { Router } = require('express');
const { formatError } = require('../../helpers/dbErrorHandler');
const { createNewUser } = require('../../services/userService');
const User = require('../../models/user');

const router = Router();

router.get('/', async (req, res) => {});

router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (err) {
    res.status(400).json(formatError(err));
  }
});

router.get('/:userId', async (req, res) => {});

router.put('/:userId', async (req, res) => {});

module.exports = router;
