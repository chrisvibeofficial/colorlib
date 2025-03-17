const axios = require('axios');
const checkoutModel = require('../models/checkout');
const productModel = require('../models/product');
const userModel = require('../models/user');
const secretKey = process.env.KORAPAY_SECRET_KEY;
const generator = require('otp-generator');
const ref = generator.generate(12, { lowerCaseAlphabets: true, upperCaseAlphabets: true, specialChars: false });
const paymentDate = new Date().toLocaleString();


exports.initializePayment = async (req, res) => {
  try {
    const paymentData = {
      amount,
      customer,
      currency: 'NGN',
      reference: ref
    };

    const response = await axios.post('https://api.korapay.com/merchant/api/v1/charges/initialize', paymentData, {
      headers: {Authorization: `Bearer ${secretKey}`}
    });

    const {data} = response.data;
    
    const transaction = new checkoutModel({
      reference: data?.reference,
      amount: paymentData.amount,
      paymentDate
    })
    await transaction.save();
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Error Initializing Payment'
    })
  }
};