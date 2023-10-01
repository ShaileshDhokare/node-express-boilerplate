const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

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

//set trust proxy
app.set('trust proxy', 1);

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Enable CORS
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
  message: 'Too many requests from this IP, please try again after some interval!',
});

app.use(limiter);

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
