const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Expense = sequelize.define('Expense', {
  amount: DataTypes.FLOAT,
  category: DataTypes.STRING,
  date: DataTypes.DATEONLY,
  description: DataTypes.STRING,
});

User.hasMany(Expense, { onDelete: 'CASCADE' });
Expense.belongsTo(User);

module.exports = Expense;
