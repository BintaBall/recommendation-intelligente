const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mongoose = require('mongoose');
const winston = require('winston');
const { Kafka } = require('kafkajs');
const handlers = require('./handlers');

// Configuration
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/articles-platform';
const KAFKA_BROKERS = process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(',') : ['localhost:9092'];

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'article-service' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Kafka setup
const kafka = new Kafka({
  clientId: 'article-service',
  brokers: KAFKA_BROKERS,
  retry: {
    initialRetryTime: 300,
    retries: 10
  }
});

const producer = kafka.producer();

// Load protobuf definition
const PROTO_PATH = path.resolve(__dirname, '../proto/article.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const articleProto = grpc.loadPackageDefinition(packageDefinition).article;

// Start gRPC server
function startServer() {
  const server = new grpc.Server();
  
  // Register service handlers
  server.addService(articleProto.ArticleService.service, {
    getArticle: (call, callback) => handlers.getArticle(call, callback, { producer, logger }),
    searchArticles: (call, callback) => handlers.searchArticles(call, callback, { producer, logger }),
    listArticles: (call, callback) => handlers.listArticles(call, callback, { producer, logger }),
    createArticle: (call, callback) => handlers.createArticle(call, callback, { producer, logger }),
    getSimilarArticles: (call, callback) => handlers.getSimilarArticles(call, callback, { producer, logger }),
    getArticlesByDomain: (call, callback) => handlers.getArticlesByDomain(call, callback, { producer, logger }),
    getArticlesByKeywords: (call, callback) => handlers.getArticlesByKeywords(call, callback, { producer, logger }),
    analyzeArticleContent: (call, callback) => handlers.analyzeArticleContent(call, callback, { producer, logger })
  });
  
  // Start listening
  server.bindAsync(
    `0.0.0.0:${PORT}`,
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
      if (error) {
        logger.error('Failed to bind gRPC server', error);
        return;
      }
      
      server.start();
      logger.info(`Article gRPC server running on port ${port}`);
    }
  );
  
  return server;
}

// Connect to MongoDB, then start server
async function start() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    logger.info('Connected to MongoDB');
    
    // Connect to Kafka
    await producer.connect();
    logger.info('Connected to Kafka');
    
    // Start gRPC server
    const server = startServer();
    
    // Setup graceful shutdown
    const shutdown = async () => {
      logger.info('Shutting down gracefully...');
      
      // Disconnect Kafka
      await producer.disconnect();
      logger.info('Disconnected from Kafka');
      
      // Close MongoDB connection
      await mongoose.connection.close();
      logger.info('Disconnected from MongoDB');
      
      // Try to stop gRPC server gracefully
      server.tryShutdown(() => {
        logger.info('gRPC server stopped');
        process.exit(0);
      });
      
      // Force exit if it takes too long
      setTimeout(() => {
        logger.error('Forcing shutdown after timeout');
        process.exit(1);
      }, 5000);
    };
    
    // Listen for termination signals
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
    
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
}

// Immediately start server
start();