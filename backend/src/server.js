require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Handle uncaught exceptions gracefully
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

connectDB();

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});