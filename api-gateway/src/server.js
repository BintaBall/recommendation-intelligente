const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const winston = require('winston');
const { typeDefs, resolvers } = require('./graphql');
const routes = require('./routes');

// Configuration
const PORT = process.env.PORT || 4000;
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:4001';
const RECOMMENDATION_SERVICE_URL = process.env.RECOMMENDATION_SERVICE_URL || 'http://localhost:4003';

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'api-gateway' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(helmet({ contentSecurityPolicy: (process.env.NODE_ENV === 'production') ? undefined : false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combiner', { stream: { write: message => logger.info(message.trim()) } }));

// API Routes
app.use('/api', routes);

// Proxy pour User Service
app.use('/api/users', createProxyMiddleware({
  target: USER_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/users': '/api/users',
    '^/api/me': '/api/me',
  },
}));

// Apollo Server pour GraphQL
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    user: req.user, // De auth middleware
  }),
  introspection: true,
  playground: process.env.NODE_ENV !== 'production',
});

// Appliquer Apollo middleware
apolloServer.applyMiddleware({ app, path: '/graphql' });

// Error middleware
app.use((err, req, res, next) => {
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  
  res.status(err.status || 500).json({
    message: err.message,
    error: process.env.NODE_ENV === 'production' ? {} : err,
  });
});

// Lancer server
app.listen(PORT, () => {
  logger.info(`API Gateway running on port ${PORT}`);
  logger.info(`GraphQL endpoint available at http://localhost:${PORT}${apolloServer.graphqlPath}`);
});

module.exports = app;