const express = require('express');
const authRoutes = require('./auth');
const userRoutes = require('./user');
const { protect } = require('../middleware/authMiddleware');

const app = express();

app.use('/auth', authRoutes);
app.use('/profile', protect, userRoutes);

module.exports = app;
