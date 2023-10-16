const Router = require('express');
const router = new Router();
const userRouter = require('./userRouter');
const userCommentRouter = require('./userCommentRouter');

router.use('/user', userRouter);
router.use('/comment', userCommentRouter);


module.exports = router;