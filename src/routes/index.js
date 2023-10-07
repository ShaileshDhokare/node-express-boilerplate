const express = require('express');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const YAML = require('yaml');

const authRoutes = require('./auth');
const userRoutes = require('./user');
const { protect } = require('../middleware/authMiddleware');

const app = express();

const file = fs.readFileSync('src/api/openApi.yaml', 'utf8');
const swaggerDocument = YAML.parse(file);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/auth', authRoutes);
app.use('/profile', protect, userRoutes);

module.exports = app;
