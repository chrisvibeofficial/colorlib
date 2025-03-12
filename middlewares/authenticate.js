const userModel = require('../models/user');
const jwt = require('jsonwebtoken');

exports.authenticate = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    const token = auth.split(' ')[1];

    if (!token) {
      return res.status(404).json({
        message: 'Token not found'
      })
    };

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(payload.userId);

    if (!user) {
      return res.status(404).json({
        message: 'Authentication Failed: Account does not exist'
      })
    };

    req.user = payload;
    next();
  } catch (error) {
    console.log(error.message);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: 'Session expired, Please login to continue'
      })
    }
    res.status(500).json({
      message: 'Error Authenticatng User'
    })
  }
};