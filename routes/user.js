const { register, verify, login, getUsers, getUser, forgotPassword, resetPassword, changePassword } = require('../controllers/userController');
const { authenticate } = require('../middlewares/authenticate');
const { validateRegister, validateLogin, validateForgotPassword, validateResetPassword, validateChangePassword } = require('../middlewares/validator');

const router = require('express').Router();

router.post('/register', validateRegister, register);
router.get('/verify/user/:token', verify);
router.post('/login', login);
router.get('/users', getUsers);
router.get('/user', authenticate, getUser);
router.post('/forgot/password', validateForgotPassword, forgotPassword);
router.post('/reset/password/:token', validateResetPassword, resetPassword);
router.post('/change/password', authenticate, validateChangePassword, changePassword);

module.exports = router