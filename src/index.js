const app = require('./app');
const Logger = require('./config/logger');

const PORT = process.env.PORT;

app.listen(PORT, () => {
  Logger.info(`The application is listening on port ${PORT}`);
});
