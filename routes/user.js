const { register, verify } = require('../controllers/userController');
const { validateRegister } = require('../middlewares/validator');

const router = require('express').Router();

router.post('/register', validateRegister, register);
router.get('/verify/user/:token', verify);

module.exports = router