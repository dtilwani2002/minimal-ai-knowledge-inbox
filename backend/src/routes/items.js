const express = require('express');
const { listItems, deleteItem } = require('../services/ingestService');

const router = express.Router();

router.get('/', (req, res, next) => {
  try {
    res.json({ items: listItems() });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', (req, res, next) => {
  try {
    deleteItem(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;