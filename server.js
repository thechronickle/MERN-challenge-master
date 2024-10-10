// server.js
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 5000;

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/transactions', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('Error connecting to MongoDB: ', err));

// Middleware to parse JSON data
app.use(express.json());

// Load Task routes
const task01Route = require('./routes/Task_01');
const task02Route = require('./routes/Task_02');
const task03Route = require('./routes/Task_03');
const task04Route = require('./routes/Task_04');
const task05Route = require('./routes/Task_05');
const task06Route = require('./routes/Task_06');

app.use('/api/task_01', task01Route);
app.use('/api/task_02', task02Route);
app.use('/api/task_03', task03Route);
app.use('/api/task_04', task04Route);
app.use('/api/task_05', task05Route);
app.use('/api/task_06', task06Route);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
