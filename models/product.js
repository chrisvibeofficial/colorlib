const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productPrice: {
    type: Number,
    require: true
  },
  description: {
    type: String,
    require: true
  },
  image: {
    imageUrl: {
      type: String,
      require: true
    },
    imagePublicId: {
      type: String,
      require: true
    }
  }
});


const productModel = mongoose.model("products", productSchema);

module.exports = productModel;