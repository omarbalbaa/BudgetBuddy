const express = require('express');
const sequelize = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const cors = require('cors');

const app = express();
app.use(express.json());

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

sequelize.sync().then(() => {
  app.listen(process.env.PORT, () => console.log('Server running'));
});
