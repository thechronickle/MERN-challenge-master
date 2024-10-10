// /routes/Task_01.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const Transaction = require('../models/Transaction');

//  API URL
const dataSourceUrl = 'https://s3.amazonaws.com/roxiler.com/product_transaction.json';

// GET API to initialize the database with data
router.get('/initialize', async (req, res) => {
  try {
    // Fetch data from the third-party API
    const response = await axios.get(dataSourceUrl);

    // Clear the collection to avoid duplicate data
    await Transaction.deleteMany({});

    // Insert the fetched data into the Transaction collection
    await Transaction.insertMany(response.data);

    // Send success response
    res.status(200).json({ message: 'Database initialized successfully with seed data.' });
  } catch (error) {
    res.status(500).json({ message: 'Error initializing the database', error: error.message });
  }
});

module.exports = router;
