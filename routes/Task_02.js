// /routes/Task_02.js
const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// GET API to list all transactions
router.get('/transactions', async (req, res) => {
  const { title, page = 1, per_page = 10 } = req.query;
  const filter = {};
  if (title) filter['transactions.transactions.title'] = new RegExp(title, 'i');  // Accessing nested title field

  try {
    const transactionsData = await Transaction.find(filter);  // Fetch the root document
    const transactionsArray = transactionsData[0]?.transactions?.transactions || [];  // Extract the nested array

    // Apply pagination to the array
    const paginatedTransactions = transactionsArray.slice((page - 1) * per_page, page * per_page);

    res.status(200).json({
      totalCount: transactionsArray.length,  // Total count of all transactions in the array
      page: Number(page),
      per_page: Number(per_page),
      transactions: paginatedTransactions
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions', error: error.message });
  }
});

module.exports = router;
