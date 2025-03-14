const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productPrice: {
    type: Number,
    require: true
  },
  description: {
    type:String,
    require:true
  },
  image: [
    imageUrl: {
      type: String
    },
    imagePublicId: {
      type: String
    }
  ],
});


const productModel = mongoose.model("products", productSchema);

module.exports = productModel;