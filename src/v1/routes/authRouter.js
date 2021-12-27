const { Router } = require('express');
const User = require('../../models/user');
const config = require('../../config');
const { createJwt } = require('../../services/authService');

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

module.exports = router;
