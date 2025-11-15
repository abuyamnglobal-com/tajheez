require('dotenv').config();
const express = require('express');
const cors = require('cors');

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
};

const app = express();
const port = process.env.PORT || 8080;

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Partnership Finance App Backend');
});

const transactionsRouter = require('./routes/transactions');
const partiesRouter = require('./routes/parties');
const categoriesRouter = require('./routes/categories');
const paymentMethodsRouter = require('./routes/payment-methods');
const usersRouter = require('./routes/users');

app.use('/api/transactions', transactionsRouter);
app.use('/api/parties', partiesRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/payment-methods', paymentMethodsRouter);
app.use('/api/users', usersRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
