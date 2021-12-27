const { Router } = require('express');
const authRouter = require('./routes/authRouter');

const router = Router();

router.use('/auth', authRouter);

module.exports = router;
