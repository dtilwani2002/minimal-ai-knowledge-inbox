const express = require('express');
const { validateQueryBody } = require('../middleware/validate');
const { answerQuestion } = require('../services/queryService');

const router = express.Router();

router.post('/', validateQueryBody, async (req, res, next) => {
  try {
    const result = await answerQuestion(req.body.question);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;