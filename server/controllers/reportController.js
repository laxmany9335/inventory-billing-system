const Product = require('../models/Product');
const Transaction = require('../models/Transaction');

// Get inventory report
const getInventoryReport = async (req, res) => {
  try {
    const products = await Product.find({ businessId: req.user._id })
      .select('name category stock price')
      .sort({ category: 1, name: 1 });

    const inventory = products.map(product => ({
      _id: product._id,
      name: product.name,
      category: product.category,
      stock: product.stock,
      price: product.price,
      totalValue: product.stock * product.price
    }));

    const totalInventoryValue = inventory.reduce((sum, item) => sum + item.totalValue, 0);

    // Group by category
    const categoryWise = {};
    inventory.forEach(item => {
      if (!categoryWise[item.category]) {
        categoryWise[item.category] = {
          totalItems: 0,
          totalValue: 0,
          products: []
        };
      }
      categoryWise[item.category].totalItems += item.stock;
      categoryWise[item.category].totalValue += item.totalValue;
      categoryWise[item.category].products.push(item);
    });

    res.json({
      success: true,
      inventory,
      totalInventoryValue,
      categoryWise,
      summary: {
        totalProducts: products.length,
        totalCategories: Object.keys(categoryWise).length,
        lowStockItems: products.filter(p => p.stock < 10).length
      }
    });
  } catch (error) {
    console.error('Inventory report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating inventory report'
    });
  }
};

// Get transaction report
const getTransactionReport = async (req, res) => {
  try {
    const { startDate, endDate, type } = req.query;
    const query = { businessId: req.user._id };

    // Add date filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Add type filter
    if (type && ['sale', 'purchase'].includes(type)) {
      query.type = type;
    }

    const transactions = await Transaction.find(query)
      .populate('customerId', 'name')
      .populate('vendorId', 'name')
      .populate('products.productId', 'name category')
      .sort({ date: -1 });

    // Calculate summary
    const salesTotal = transactions
      .filter(t => t.type === 'sale')
      .reduce((sum, t) => sum + t.totalAmount, 0);

    const purchaseTotal = transactions
      .filter(t => t.type === 'purchase')
      .reduce((sum, t) => sum + t.totalAmount, 0);

    // Group by date
    const dailySummary = {};
    transactions.forEach(transaction => {
      const date = transaction.date.toISOString().split('T')[0];
      if (!dailySummary[date]) {
        dailySummary[date] = {
          sales: 0,
          purchases: 0,
          salesCount: 0,
          purchaseCount: 0
        };
      }
      if (transaction.type === 'sale') {
        dailySummary[date].sales += transaction.totalAmount;
        dailySummary[date].salesCount++;
      } else {
        dailySummary[date].purchases += transaction.totalAmount;
        dailySummary[date].purchaseCount++;
      }
    });

    res.json({
      success: true,
      transactions,
      summary: {
        totalTransactions: transactions.length,
        salesTotal,
        purchaseTotal,
        netProfit: salesTotal - purchaseTotal,
        salesCount: transactions.filter(t => t.type === 'sale').length,
        purchaseCount: transactions.filter(t => t.type === 'purchase').length
      },
      dailySummary
    });
  } catch (error) {
    console.error('Transaction report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating transaction report'
    });
  }
};

module.exports = {
  getInventoryReport,
  getTransactionReport
};
