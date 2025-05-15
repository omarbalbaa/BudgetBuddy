const Expense = require('../models/Expense');

exports.create = async (req, res) => {
  const exp = await Expense.create({ ...req.body, UserId: req.userId });
  res.json(exp);
};

exports.getAll = async (req, res) => {
  const where = { UserId: req.userId, ...req.query };
  const expenses = await Expense.findAll({ where });
  res.json(expenses);
};

exports.getOne = async (req, res) => {
  const exp = await Expense.findOne({ where: { id: req.params.id, UserId: req.userId } });
  if (!exp) return res.status(404).json({ msg: 'Not found' });
  res.json(exp);
};

exports.update = async (req, res) => {
  const exp = await Expense.findOne({ where: { id: req.params.id, UserId: req.userId } });
  if (!exp) return res.status(404).json({ msg: 'Not found' });
  await exp.update(req.body);
  res.json(exp);
};

exports.remove = async (req, res) => {
  const deleted = await Expense.destroy({ where: { id: req.params.id, UserId: req.userId } });
  res.json({ deleted });
};
