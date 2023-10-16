const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController');
const {body} = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min: 5, max: 32}),
    userController.registration);

router.post('/login',
    body('email').isEmail(),
    body('password').isLength({min: 5, max: 32}),
    userController.login);

router.get('/refresh', userController.refresh);

router.put('/activate/:activationLink', userController.activate);

router.put('/logout/:id', userController.logout);

router.post('/resetlink', body('email').isEmail(), userController.addResetLink);

router.put('/verificationResetLink/:passwordResetLink', userController.verificationResetLink);

router.post('/changePassword',
    body('email').isEmail(),
    body('password').isLength({min: 5, max: 32}),
    userController.changePassword);

router.post('/sendnumberphone', userController.sendNumberPhone);

module.exports = router
