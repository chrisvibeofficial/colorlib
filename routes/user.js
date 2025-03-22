const { register, verify, login, getUsers, getUser, forgotPassword, resetPassword, changePassword } = require('../controllers/userController');
const { authenticate } = require('../middlewares/authenticate');
const { validateRegister, validateLogin, validateForgotPassword, validateResetPassword, validateChangePassword } = require('../middlewares/validator');

const router = require('express').Router();


/**
 * @swagger
 * /api/v1/register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *                 description: The username of the user
 *                 example: JohnDoe
 *               email:
 *                 type: string
 *                 description: The email of the user
 *                 example: johndoe@sample.com
 *               password:
 *                 type: string
 *                 description: The password of the user
 *                 example: Password@123
 *               confirmPassword:
 *                 type: string
 *                 description: Must match with the password
 *                 example: Password@123
 *     responses:
 *       201:
 *         description: Account registered successfully
 *       400:
 *         description: Password does not match / Email or Username already exists
 *       500:
 *         description: Error Registering User
 *
 * /api/v1/verify/user/{token}:
 *   get:
 *     summary: Verify a user account
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: JWT token for account verification
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Account verified successfully
 *       400:
 *         description: Account already verified
 *       404:
 *         description: Token not found / Account not found
 *       500:
 *         description: Error Verifying User
 *
 * /api/v1/login:
 *   post:
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *                 description: The username of the user
 *                 example: JohnDoe
 *               password:
 *                 type: string
 *                 description: The password of the user
 *                 example: Password@123
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Incorrect Password
 *       404:
 *         description: Account not found
 *       500:
 *         description: Error Logging User In
 *
 * /api/v1/users:
 *   get:
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: List of all users
 *       400:
 *         description: No account found
 *       500:
 *         description: Error Getting Users
 *
 * /api/v1/user:
 *   get:
 *     summary: Get a user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 *       404:
 *         description: User does not exist
 *       500:
 *         description: Error Getting User
 *
 * /api/v1/forgot/password:
 *   post:
 *     summary: Send a password reset link
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user
 *                 example: johndoe@sample.com
 *     responses:
 *       201:
 *         description: Link has been sent to email address
 *       404:
 *         description: Account does not exist
 *       500:
 *         description: Error Forgetting Password
 *
 * /api/v1/reset/password/{token}:
 *   post:
 *     summary: Reset user password
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: JWT token for resetting password
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 description: The new password
 *                 example: NewPassword@123
 *               confirmPassword:
 *                 type: string
 *                 description: Must match the new password
 *                 example: NewPassword@123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Passwords do not match / Session expired
 *       404:
 *         description: Token not found / User does not exist
 *       500:
 *         description: Error Resetting Password
 *
 * /api/v1/change/password:
 *   post:
 *     summary: Change user password
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: Current password of the user
 *                 example: Password@123
 *               newPassword:
 *                 type: string
 *                 description: New password for the user
 *                 example: NewPassword@123
 *               confirmPassword:
 *                 type: string
 *                 description: Must match the new password
 *                 example: NewPassword@123
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Incorrect Password / Passwords do not match
 *       404:
 *         description: Account not found
 *       500:
 *         description: Error Updating User
 */



router.post('/register', validateRegister, register);
router.get('/verify/user/:token', verify);
router.post('/login', validateLogin, login);
router.get('/users', getUsers);
router.get('/user', authenticate, getUser);
router.post('/forgot/password', validateForgotPassword, forgotPassword);
router.post('/reset/password/:token', validateResetPassword, resetPassword);
router.post('/change/password', authenticate, validateChangePassword, changePassword);

module.exports = router