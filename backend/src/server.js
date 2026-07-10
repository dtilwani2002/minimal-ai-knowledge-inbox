const express = require('express');
const cors = require('cors');
const config = require('./config');
const logger = require('./logger');
require('./db/database'); // initializes schema on startup

const ingestRouter = require('./routes/ingest');
const itemsRouter = require('./routes/items');
const queryRouter = require('./routes/query');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.use((req, res, next) => {
  logger.info({ method: req.method, path: req.path }, 'Incoming request');
  next();
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/ingest', ingestRouter);
app.use('/items', itemsRouter);
app.use('/query', queryRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(config.port, () => {
  logger.info(`Server listening on http://localhost:${config.port}`);
});