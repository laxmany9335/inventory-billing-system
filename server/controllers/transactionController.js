const Transaction = require('../models/Transaction');
const Product = require('../models/Product');
const Contact = require('../models/Contact');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Get all transactions
const getTransactions = async (req, res) => {
  try {
    const { type, startDate, endDate, page = 1, limit = 10 } = req.query;
    const query = { businessId: req.user._id };

    // Add type filter
    if (type && ['sale', 'purchase'].includes(type)) {
      query.type = type;
    }

    // Add date filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(query)
      .populate('customerId', 'name phone email')
      .populate('vendorId', 'name phone email')
      .populate('products.productId', 'name category')
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Transaction.countDocuments(query);

    res.json({
      success: true,
      transactions,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching transactions'
    });
  }
};

// Create transaction
const createTransaction = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { type, customerId, vendorId, products } = req.body;

    // Validate contact exists and belongs to user
    let contactId = type === 'sale' ? customerId : vendorId;
    const contact = await Contact.findOne({
      _id: contactId,
      businessId: req.user._id,
      type: type === 'sale' ? 'customer' : 'vendor'
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: `${type === 'sale' ? 'Customer' : 'Vendor'} not found`
      });
    }

    // Calculate total and validate products
    let totalAmount = 0;
    const productUpdates = [];

    for (const item of products) {
      const product = await Product.findOne({
        _id: item.productId,
        businessId: req.user._id
      });

      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }

      // Check stock for sales
      if (type === 'sale' && product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product ${product.name}. Available: ${product.stock}, Required: ${item.quantity}`);
      }

      totalAmount += item.quantity * item.price;

      // Prepare stock updates
      const stockChange = type === 'sale' ? -item.quantity : item.quantity;
      productUpdates.push({
        productId: item.productId,
        stockChange
      });
    }

    // Create transaction
    const transaction = new Transaction({
      type,
      customerId: type === 'sale' ? customerId : undefined,
      vendorId: type === 'purchase' ? vendorId : undefined,
      products,
      totalAmount,
      businessId: req.user._id
    });

    await transaction.save({ session });

    // Update product stocks
    for (const update of productUpdates) {
      await Product.findByIdAndUpdate(
        update.productId,
        { $inc: { stock: update.stockChange } },
        { session }
      );
    }

    await session.commitTransaction();

    // Populate the transaction for response
    await transaction.populate([
      { path: 'customerId', select: 'name phone email' },
      { path: 'vendorId', select: 'name phone email' },
      { path: 'products.productId', select: 'name category' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      transaction
    });

  } catch (error) {
    await session.abortTransaction();
    console.error('Create transaction error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error creating transaction'
    });
  } finally {
    session.endSession();
  }
};

module.exports = {
  getTransactions,
  createTransaction
};