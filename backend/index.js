require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Partnership Finance App Backend');
});

const transactionsRouter = require('./routes/transactions');
const partiesRouter = require('./routes/parties');

app.use('/api/transactions', transactionsRouter);
app.use('/api/parties', partiesRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
