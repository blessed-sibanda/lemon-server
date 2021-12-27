const { Router } = require('express');
const userRouter = require('./routes/userRouter');

const router = Router();

router.use('/users?', userRouter);

module.exports = router;
