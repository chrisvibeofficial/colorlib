const axios = require('axios');
const paymentModel = require('../models/payment');
const productModel = require('../models/product');
const userModel = require('../models/user');
const paymentGatewayUrl = 'https://api.paystack.co/';

exports.initializePayment = async (req, res) => {
  try {
    const { userId } = req.user;
    const { products } = req.body;
    let totalAmount = 0;
    let totalPrice = 0;

    for (let p = 0; p < products.length; p++) {
      const product = await productModel.findOne({ productName: products[p].productName });

      if (product && product.productPrice) {
        totalAmount = totalPrice += product.productPrice
      }
    };

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: 'User does not exist'
      })
    };

    const userData = {
      amount: totalAmount * 100,
      email: user.email
    };

    const response = await axios.post(`${paymentGatewayUrl}/transaction/initialize`, userData, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` }
    });

    const { data } = response;

    const paymentDetails = new paymentModel({
      reference: data.data.reference,
      email: user.email,
      totalAmount: userData.amount
    });

    await paymentDetails.save();
    res.json({
      authorizationUrl: data?.data.authorization_url,
      reference: data?.data.reference
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Error Initializing Payment'
    })
  }
};