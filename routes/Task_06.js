// /routes/Task_06.js
const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// Price ranges for bar chart
const priceRanges = [
  { range: '0-100', min: 0, max: 100 },
  { range: '101-200', min: 101, max: 200 },
  { range: '201-300', min: 201, max: 300 },
  { range: '301-400', min: 301, max: 400 },
  { range: '401-500', min: 401, max: 500 },
  { range: '501-600', min: 501, max: 600 },
  { range: '601-700', min: 601, max: 700 },
  { range: '701-800', min: 701, max: 800 },
  { range: '801-900', min: 801, max: 900 },
  { range: '901-above', min: 901, max: Infinity }
];

// GET API to combine statistics, bar chart, and pie chart data
router.get('/combined', async (req, res) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).json({ message: "Month is required" });
  }

  // Map month name to a number
  const monthMap = {
    January: 0,
    February: 1,
    March: 2,
    April: 3,
    May: 4,
    June: 5,
    July: 6,
    August: 7,
    September: 8,
    October: 9,
    November: 10,
    December: 11
  };

  const monthNumber = monthMap[month];
  if (monthNumber === undefined) {
    return res.status(400).json({ message: "Invalid month value" });
  }

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

    // Prepare pie chart data
    const categoryCounts = filteredTransactions.reduce((acc, transaction) => {
      const category = transaction.category;
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    const pieChartData = Object.keys(categoryCounts).map(key => ({
      category: key,
      count: categoryCounts[key]
    }));

    // Prepare bar chart data
    const priceRangeCounts = priceRanges.map(range => ({
      range: range.range,
      count: 0
    }));

    filteredTransactions.forEach(transaction => {
      const price = transaction.price;
      priceRangeCounts.forEach(range => {
        if (price >= range.min && price <= range.max) {
          range.count++;
        }
      });
    });

    // Combine all data
    const combinedData = {
      statistics: {
        totalSaleAmount,
        totalSoldItems,
        totalNotSoldItems
      },
      pieChart: pieChartData,
      barChart: priceRangeCounts
    };

    res.status(200).json(combinedData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching combined data', error: error.message });
  }
});

module.exports = router;
