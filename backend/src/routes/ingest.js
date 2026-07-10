const express = require('express');
const { validateIngestBody } = require('../middleware/validate');
const { ingestNote, ingestUrl } = require('../services/ingestService');

const router = express.Router();

router.post('/', validateIngestBody, async (req, res, next) => {
  try {
    const { type, content } = req.body;
    const item = type === 'note' ? await ingestNote(content) : await ingestUrl(content);
    res.status(201).json({ item });
  } catch (err) {
    next(err);
  }
});

module.exports = router;