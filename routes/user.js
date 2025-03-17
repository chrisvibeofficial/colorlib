const { register, verify, login, getUsers, getUser, forgotPassword, resetPassword, changePassword } = require('../controllers/userController');
const { authenticate } = require('../middlewares/authenticate');
const { validateRegister, validateLogin, validateForgotPassword, validateResetPassword, validateChangePassword } = require('../middlewares/validator');

const router = require('express').Router();


/**
 *@swagger
    /api/v1/register:
      post:
        summary: Register a new user
        description: Creates a new user account.
        requestBody:
          required: true
          content:
            application/json:
              schema:
                type: object
                properties:
                  userName:
                    type: string
                  email:
                    type: string
                  password:
                    type: string
                  confirmPassword:
                    type: string
        responses:
          '201':
            description: Account registered successfully.
          '400':
            description: Validation errors or account already exists.
          '500':
            description: Server error.

    /api/v1/verify/user/{token}:
      get:
        summary: Verify user account
        description: Verifies the user's account using a token.
        parameters:
          - name: token
            in: path
            required: true
            schema:
              type: string
        responses:
          '200':
            description: Account verified successfully.
          '400':
            description: Token expired or invalid.
          '404':
            description: Token or user not found.

    /api/v1/login:
      post:
        summary: Log in a user
        description: Authenticates a user and returns a token.
        requestBody:
          required: true
          content:
            application/json:
              schema:
                type: object
                properties:
                  userName:
                    type: string
                  password:
                    type: string
        responses:
          '200':
            description: User logged in successfully.
          '400':
            description: Incorrect password.
          '404':
            description: User not found.
          '500':
            description: Server error.

    /api/v1/users:
      get:
        summary: Get all users
        description: Retrieves a list of all users.
        responses:
          '200':
            description: List of users.
          '400':
            description: No accounts found.
          '500':
            description: Server error.

    /api/v1/user:
      get:
        summary: Get a user
        description: Retrieves details of a specific user.
        security:
          - bearerAuth: []
        responses:
          '200':
            description: User details.
          '404':
            description: User not found.
          '500':
            description: Server error.

    /api/v1/forgot/password:
      post:
        summary: Forgot password
        description: Sends a reset password link to the user's email.
        requestBody:
          required: true
          content:
            application/json:
              schema:
                type: object
                properties:
                  email:
                    type: string
        responses:
          '201':
            description: Reset password link sent.
          '404':
            description: Account does not exist.
          '500':
            description: Server error.

    /api/v1/reset/password/{token}:
      post:
        summary: Reset password
        description: Resets the user's password using a token.
        parameters:
          - name: token
            in: path
            required: true
            schema:
              type: string
        requestBody:
          required: true
          content:
            application/json:
              schema:
                type: object
                properties:
                  newPassword:
                    type: string
                  confirmPassword:
                    type: string
        responses:
          '200':
            description: Password reset successfully.
          '400':
            description: Password mismatch or token expired.
          '404':
            description: Token or user not found.
          '500':
            description: Server error.

    /api/v1/change/password:
      post:
        summary: Change password
        description: Changes the user's password.
        security:
          - bearerAuth: []
        requestBody:
          required: true
          content:
            application/json:
              schema:
                type: object
                properties:
                  password:
                    type: string
                  newPassword:
                    type: string
                  confirmPassword:
                    type: string
        responses:
          '200':
            description: Password changed successfully.
          '400':
            description: Password mismatch or incorrect password.
          '404':
            description: Account not found.
          '500':
            description: Server error.

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