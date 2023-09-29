const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const cookieParser = require('cookie-parser');
const StatusCodes = require('http-status-codes').StatusCodes;

const Logger = require('./config/logger');
const morganMiddleware = require('./middleware/morganMiddleware');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const sequelizeDB = require('./config/dbConnection');

const indexRouter = require('./routes/index');
const { protect } = require('./middleware/authMiddleware');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(morganMiddleware);

app.use('/static', protect, express.static(path.join(__dirname, 'public')));

sequelizeDB
  .authenticate() // eslint-disable-next-line
  .then((result) => {
    Logger.info('Connection has been established successfully.');
  })
  .catch((error) => {
    Logger.error({ message: 'Unable to connect to the database:', error });
  });

app.get('/', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'Application is live.' });
});

//API Routes
app.use('/api/v1', indexRouter);

// throw 404 if URL not found
app.use(notFound);
app.use(errorHandler);

module.exports = app;
