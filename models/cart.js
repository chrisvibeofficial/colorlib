const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "users"
  },
  products: [{
    productId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "products"
    },
    quantity: {
      type: Number,
      default: 1
    },
    unitPrice: {
      type: Number,
      required: true
    },
    totalPrice: {
      type: Number,
      required: true
    },
    productName: {
      type: String,
      required: true
    }
  }],
  grandTotal: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const cartModel = mongoose.model("carts", cartSchema)

module.exports = cartModel