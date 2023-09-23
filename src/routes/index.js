const express = require('express');
const userRoutes = require('./user');

const app = express();

app.use('/users', userRoutes);

module.exports = app;
