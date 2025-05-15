const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const winston = require('winston');
const { Kafka } = require('kafkajs');
const routes = require('./routes');

// Configuration
const PORT = process.env.PORT || 4001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/articles-platform';
const KAFKA_BROKERS = process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(',') : ['localhost:9092'];

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Kafka setup
const kafka = new Kafka({
  clientId: 'user-service',
  brokers: KAFKA_BROKERS,
  retry: {
    initialRetryTime: 300,
    retries: 10
  }
});

const producer = kafka.producer();

// MongoDB connection
mongoose.connect(MONGO_URI)
  .then(() => {
    logger.info('Connected to MongoDB');
    
    // Start Kafka producer after database connection
    return producer.connect();
  })
  .then(() => {
    logger.info('Connected to Kafka');
    
    // Inject Kafka producer into app for controllers to use
    app.locals.kafkaProducer = producer;
    
    // Start server after connections are established
    app.listen(PORT, () => {
      logger.info(`User Service running on port ${PORT}`);
    });
  })
  .catch(err => {
    logger.error('Failed to connect to database or Kafka', err);
    process.exit(1);
  });

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// API Routes
app.use('/api', routes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'User Service is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  
  res.status(err.status || 500).json({
    message: err.message,
    error: process.env.NODE_ENV === 'production' ? {} : err,
  });
});

// Graceful shutdown
const shutdown = async () => {
  try {
    await producer.disconnect();
    logger.info('Disconnected from Kafka');
    
    await mongoose.connection.close();
    logger.info('Disconnected from MongoDB');
    
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown', error);
    process.exit(1);
  }
};

// Listen for termination signals
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

module.exports = app;