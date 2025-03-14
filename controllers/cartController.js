const cartModel = require('../models/cart');
const userModel = require('../models/user');
const productModel = require('../models/product');

exports.addToCart = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const { quantity } = req.body;

    const existingCart = await cartModel.findOne({ userId: userId });

    if (existingCart) {
      
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Error Adding To Cart'
    })
  }
};