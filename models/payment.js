const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  reference: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true
  },
  totalAmount: {
    type: Number,
    require: true
  }
}, { timestamps: true });

const paymentModel = mongoose.model('payments', paymentSchema);

module.exports = paymentModel;