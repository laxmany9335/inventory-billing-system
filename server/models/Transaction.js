
// src/models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'Transaction type is required'],
    enum: ['sale', 'purchase']
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact',
    required: function() { return this.type === 'sale'; }
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact',
    required: function() { return this.type === 'purchase'; }
  },
  products: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative']
    }
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: [0, 'Total amount cannot be negative']
  },
  date: {
    type: Date,
    default: Date.now
  },
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

transactionSchema.index({ businessId: 1, type: 1, date: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);