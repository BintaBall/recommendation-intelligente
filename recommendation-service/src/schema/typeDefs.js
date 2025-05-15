const { gql } = require('apollo-server');

const typeDefs = gql`
  type Article {
    id: ID!
    title: String
    abstract: String
    domain: String
    score: Float
  }

  type Query {
    recommendedArticles(userId: ID!): [Article]
  }
`;

module.exports = typeDefs;