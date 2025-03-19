const { verify, reset } = require('../helper/html');
const { send_email } = require('../middlewares/nodemailer');
const userModel = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


// ONBORDING SECTION

exports.register = async (req, res) => {
  try {
    const { userName, email, password, confirmPassword } = req.body

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: 'Password does not match'
      })
    };

    const existingEmail = await userModel.find({ email: email.toLowerCase() });

    if (existingEmail.length === 1) {
      return res.status(400).json({
        message: `Account with email: ${email} already exist`
      })
    };

    const existingusername = await userModel.find({ userName: userName.toLowerCase() });

    if (existingusername.length === 1) {
      return res.status(400).json({
        message: `Account with username: ${userName} already exist`
      })
    };

    const saltedRound = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, saltedRound);

    const newUser = new userModel({
      userName,
      email,
      password: hashedPassword
    });

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '5mins' });
    const link = `${req.protocol}://${req.get('host')}/verify/user/${token}`;

    const mailFormat = {
      email: newUser.email,
      html: verify(link, newUser.userName),
      subject: 'ACCOUNT VERIFICATION'
    };

    await send_email(mailFormat);
    await newUser.save();
    res.status(201).json({
      message: 'Account registered successfully',
      data: newUser
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Error Registering User'
    })
  }
};


exports.verify = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(404).json({
        message: 'Token not found'
      })
    };

    jwt.verify(token, process.env.JWT_SECRET, async (error, payload) => {
      if (error) {
        if (error instanceof jwt.JsonWebTokenError) {
          const { userId } = jwt.decode(token);
          const user = await userModel.findById(userId);

          if (!user) {
            return res.status(404).json({
              message: 'Account not found'
            })
          };

          if (user.isVerified === true) {
            return res.status(400).json({
              message: 'Account is already verified'
            })
          };

          const newToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '5mins' });
          const link = `${req.protocol}://${req.get('host')}/api/v1/verify/user/${newToken}`;

          const mailFormat = {
            email: user.email,
            html: verify(link, user.userName),
            subject: 'RESEND: ACCOUNT VERIFICATION'
          };

          await send_email(mailFormat);
          res.status(201).json({
            message: 'Session expired, Link has been sent to email address',
          })
        }
      } else {
        const user = await userModel.findById(payload.userId);

        if (!user) {
          return res.status(404).json({
            message: 'Account not found'
          })
        };

        if (user.isVerified === true) {
          return res.status(400).json({
            message: 'Account is already verified'
          })
        };

        user.isVerified = true;
        await user.save();
        res.status(200).json({
          message: 'Account verified successfully'
        })
      }
    })
  } catch (error) {
    console.log(error.message);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: 'Session expired, Link has been sent to email address'
      })
    }
    res.status(500).json({
      message: 'Error Verifying User'
    })
  }
};


exports.login = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await userModel.findOne({ userName: userName });

    if (!user) {
      return res.status(404).json({
        message: 'Account not found'
      })
    };

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(400).json({
        message: 'Incorrect Password'
      })
    };

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '5mins' });
    res.status(200).json({
      message: 'User logged in successfully',
      token
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Error Logging User In'
    })
  }
};


exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        message: 'Account does not exist'
      })
    };

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '5mins' });
    const link = `https://e-store-group-project.vercel.app/resetpassword/${token}`;

    const mailFormat = {
      email: user.email,
      html: reset(link, user.userName),
      subject: 'RESET PASSWORD'
    };

    await send_email(mailFormat);
    res.status(201).json({
      message: 'Link has been sent to email address',
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Error Forgetting Password'
    })
  }
};


exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;

    if (!token) {
      return res.status(404).json({
        message: 'Token not found'
      })
    };

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: 'Password does not match'
      })
    };

    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: 'User does not exist'
      })
    };

    const saltedRound = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, saltedRound);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      message: 'Password reset successfully'
    })
  } catch (error) {
    console.log(error.message);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: 'Session expire, Click on forgot password to continue'
      })
    }
    res.status(500).json({
      message: 'Error Resetting Password'
    })
  }
};


// CRUD OPERATION SECTION

exports.getUsers = async (req, res) => {
  try {
    const users = await userModel.find();

    if (users === 0) {
      return res.status(400).json({
        message: 'No Account Found'
      })
    };

    res.status(200).json({
      message: 'All users below',
      data: users
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Error Getting Users'
    })
  }
};


exports.getUser = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: 'User does not exist'
      })
    };

    res.status(200).json({
      message: 'User below',
      data: user
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Error Getting User'
    })
  }
};


exports.changePassword = async (req, res) => {
  try {
    const { userId } = req.user;
    const { password, newPassword, confirmPassword } = req.body;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: 'Account not found'
      })
    };

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(400).json({
        message: 'Incorrect Password'
      })
    };

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: 'Password does not match'
      })
    };

    const saltedRound = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, saltedRound);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      message: 'Password changed successfully'
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Error Updating User'
    })
  }
};