const { Router } = require('express');
const User = require('../../models/user');
const config = require('../../config');
const { createJwt, requireAuth } = require('../../services/authService');

const router = Router();

router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user && user.authenticate(req.body.password))
    return res.json({ accessToken: await createJwt(user) });
  else
    return res.status(401).json({
      message: 'Invalid email/password',
    });
});

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    let user = await User.findById(req.auth.sub);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
