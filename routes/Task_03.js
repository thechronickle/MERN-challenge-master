// /routes/Task_03.js
const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// GET API for statistics
router.get('/statistics', async (req, res) => {
  const { month } = req.query;

  if (!month) return res.status(400).json({ message: "Month is required" });

  const monthMap = {
    January: 0, February: 1, March: 2, April: 3, May: 4,
    June: 5, July: 6, August: 7, September: 8, October: 9,
    November: 10, December: 11
  };

  const monthNumber = monthMap[month];
  if (monthNumber === undefined) return res.status(400).json({ message: "Invalid month value" });

  try {
    const transactionsData = await Transaction.find({});
    const transactionsArray = transactionsData[0]?.transactions?.transactions || [];

    // Filter transactions for the selected month
    const filteredTransactions = transactionsArray.filter(transaction => {
      const transactionDate = new Date(transaction.dateOfSale);
      return transactionDate.getMonth() === monthNumber;
    });

    // Calculate statistics
    const totalSaleAmount = filteredTransactions.reduce((sum, t) => sum + t.price, 0);
    const totalSoldItems = filteredTransactions.filter(t => t.sold).length;
    const totalNotSoldItems = filteredTransactions.filter(t => !t.sold).length;

    res.status(200).json({ totalSaleAmount, totalSoldItems, totalNotSoldItems });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating statistics', error: error.message });
  }
});

module.exports = router;
