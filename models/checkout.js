const mongoose = require('mongoose');

const checkoutSchema = new mongoose.Schema({
  reference: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true
  },
  amount: {
    type: Number,
    require: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Success', 'Failed'],
    default: 'Pending'
  },
  paymentDate: {
    type: String,
    require: true
  }
}, { timestamps: true });

const checkoutModel = mongoose.model('checkouts', checkoutSchema);

module.exports = checkoutModel;