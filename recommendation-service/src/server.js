const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const typeDefs = require('./schema/typeDefs');
const resolvers = require('./resolvers');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://mongodb:27017/recommendationdb';

(async () => {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to Recommendation DB');

    const server = new ApolloServer({ typeDefs, resolvers });

    server.listen({ port: 4003 }).then(({ url }) => {
      console.log(`Recommendation service is running at ${url}`);
    });
  } catch (error) {
    console.error('Error connecting to the DB', error);
  }
})();
