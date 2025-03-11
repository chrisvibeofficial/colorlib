const { register, verify, login } = require('../controllers/userController');
const { validateRegister, validateLogin } = require('../middlewares/validator');

const router = require('express').Router();

router.post('/register', validateRegister, register);
router.get('/verify/user/:token', verify);
router.post('/login', validateLogin, login)

module.exports = router