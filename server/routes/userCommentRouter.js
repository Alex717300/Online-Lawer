const Router = require('express');
const router = new Router();
const userCommentController = require('../controllers/UserCommentController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, userCommentController.addOne);
router.get('/',  userCommentController.getAll);
router.get('/getformoderation/:userId', authMiddleware, userCommentController.getForModeration);
router.put('/updateaftermoderation', authMiddleware, userCommentController.updateAfterModeration);
router.get('/getforeditor/:userId', authMiddleware, userCommentController.getForEditor);
router.put('/', authMiddleware, userCommentController.updateComment);
router.delete('/:id', authMiddleware, userCommentController.deleteOne);

module.exports = router
