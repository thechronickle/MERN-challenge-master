// /models/Transaction.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//  Transaction schema
const TransactionSchema = new Schema({
  transactions: {
    transactions: [{
      title: { type: String, required: true },
      description: { type: String, required: true },
      price: { type: Number, required: true },
      category: { type: String, required: true },
      dateOfSale: { type: Date, required: true },
      sold: { type: Boolean, required: true }
    }]
  }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
