const joi = require('joi');

exports.validateRegister = (req, res, next) => {
  const schema = joi.object({
    userName: joi.string().trim().min(3).pattern(/^[A-Za-z]+$/).required(),
    email: joi.string().trim().email().required(),
    password: joi.string().pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/).required(),
    confirmPassword: joi.string().pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/).required()
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      message: error.message
    })
  };

  next()
};


exports.validateLogin = (req, res, next) => {
  const schema = joi.object({
    userName: joi.string().trim().min(3).pattern(/^[A-Za-z]+$/).required(),
    password: joi.string().pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/).required(),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      message: error.message
    })
  };

  next()
};