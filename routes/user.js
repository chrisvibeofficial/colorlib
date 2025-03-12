const { register, verify, login, getUsers, getUser, forgotPassword, resetPassword } = require('../controllers/userController');
const { validateRegister, validateLogin, validateForgotPassword, validateResetPassword } = require('../middlewares/validator');

const router = require('express').Router();

router.post('/register', validateRegister, register);
router.get('/verify/user/:token', verify);
router.post('/login', validateLogin, login);
router.get('/users', getUsers);
router.get('/user', getUser);
router.post('/forgot/password', validateForgotPassword, forgotPassword);
router.post('/reset/password/:token', validateResetPassword, resetPassword);

module.exports = router