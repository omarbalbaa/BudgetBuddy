const express = require('express');
const auth = require('../middleware/authMiddleware');
const { Op } = require('sequelize');
const Expense = require('../models/Expense');
const router = express.Router();

router.use(auth);

// Create expense
router.post('/', async (req, res) => {
  try {
    const expense = await Expense.create({
      ...req.body,
      UserId: req.userId
    });
    res.json(expense);
  } catch (error) {
    res.status(400).json({ message: 'Invalid expense data' });
  }
});

// Get all expenses with filters
router.get('/', async (req, res) => {
  try {
    const where = { UserId: req.userId };
    
    // Category filter
    if (req.query.category) {
      where.category = {
        [Op.like]: `%${req.query.category}%`
      };
    }
    
    // Date range filter
    if (req.query.fromDate || req.query.toDate) {
      where.date = {};
      if (req.query.fromDate) {
        where.date[Op.gte] = req.query.fromDate;
      }
      if (req.query.toDate) {
        where.date[Op.lte] = req.query.toDate;
      }
    }

    const expenses = await Expense.findAll({
      where,
      order: [['date', 'DESC']],
    });
    
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch expenses' });
  }
});

// Get single expense
router.get('/:id', async (req, res) => {
  try {
    const expense = await Expense.findOne({
      where: {
        id: req.params.id,
        UserId: req.userId
      }
    });
    
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch expense' });
  }
});

// Update expense
router.put('/:id', async (req, res) => {
  try {
    const expense = await Expense.findOne({
      where: {
        id: req.params.id,
        UserId: req.userId
      }
    });
    
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    
    await expense.update(req.body);
    res.json(expense);
  } catch (error) {
    res.status(400).json({ message: 'Invalid update data' });
  }
});

// Delete expense
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Expense.destroy({
      where: {
        id: req.params.id,
        UserId: req.userId
      }
    });
    
    if (!deleted) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete expense' });
  }
});

module.exports = router;
