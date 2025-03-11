const { verify } = require('../helper/html');
const { send_email } = require('../middlewares/nodemailer');
const userModel = require('../models/user');
const jwt = require('jsonwebtoken');


exports.register = async (req, res) => {
  try {
    const { userName, email, password, confirmPassword } = req.body

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: 'Password does not match'
      })
    };

    const user = await userModel.find({ email: email.toLowerase() } && { userName: userName.toLowerase() });

    if (user.length === 1) {
      return res.status(400).json({
        message: 'Account already exist'
      })
    };

    const newUser = new userModel({
      userName,
      email,
      password
    });

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '5mins' });
    const link = `${req.protocol}://${req.get('host')}/api/v1/verify/user/${token}`;

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
}