const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'users',
    require: true
  },
  items: [{
    productId: {
      type: String,
      require: true
    },
    quantity: {
      type: Number,
      require: true
    }
  }]
}, { timestamps: true });

const cartModel = mongoose.model('carts', cartSchema);

module.exports = cartModel;