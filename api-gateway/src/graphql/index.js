const { gql } = require('apollo-server-express');
const axios = require('axios');

// GraphQL Schema
const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    interests: [String!]
    createdAt: String!
  }

  type Article {
    id: ID!
    title: String!
    abstract: String!
    authors: [String!]!
    domain: String!
    keywords: [String!]!
    publicationDate: String!
    url: String
  }

  type Recommendation {
    id: ID!
    userId: ID!
    articleId: ID!
    article: Article
    score: Float!
    reason: String
    createdAt: String!
  }

  type Query {
    me: User
    recommendations(limit: Int): [Recommendation!]!
    article(id: ID!): Article
    searchArticles(query: String!, limit: Int): [Article!]!
  }

  type Mutation {
    updateInterests(interests: [String!]!): User!
  }
`;

// Resolvers implemente schema
const resolvers = {
  Query: {
    me: async (_, __, { user }) => {
      if (!user) return null;
      
      try {
        const response = await axios.get(
          `${process.env.USER_SERVICE_URL}/api/users/${user.id}`
        );
        return response.data;
      } catch (error) {
        console.error('Error fetching user:', error);
        throw new Error('Failed to fetch user data');
      }
    },
    
    recommendations: async (_, { limit = 10 }, { user }) => {
      if (!user) throw new Error('Authentication required');
      
      try {
        const response = await axios.get(
          `${process.env.RECOMMENDATION_SERVICE_URL}/graphql`,
          {
            params: { query: `{ recommendations(userId: "${user.id}", limit: ${limit}) { id userId articleId score reason createdAt } }` }
          }
        );
        
        return response.data.data.recommendations;
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        throw new Error('Failed to fetch recommendations');
      }
    },
    
    article: async (_, { id }) => {
      try {
        const response = await axios.get(
          `${process.env.RECOMMENDATION_SERVICE_URL}/graphql`,
          {
            params: { query: `{ article(id: "${id}") { id title abstract authors domain keywords publicationDate url } }` }
          }
        );
        
        return response.data.data.article;
      } catch (error) {
        console.error('Error fetching article:', error);
        throw new Error('Failed to fetch article');
      }
    },
    
    searchArticles: async (_, { query, limit = 10 }) => {
      try {
        const response = await axios.get(
          `${process.env.RECOMMENDATION_SERVICE_URL}/graphql`,
          {
            params: { query: `{ searchArticles(query: "${query}", limit: ${limit}) { id title abstract authors domain keywords publicationDate url } }` }
          }
        );
        
        return response.data.data.searchArticles;
      } catch (error) {
        console.error('Error searching articles:', error);
        throw new Error('Failed to search articles');
      }
    },
  },
  
  Mutation: {
    updateInterests: async (_, { interests }, { user }) => {
      if (!user) throw new Error('Authentication required');
      
      try {
        const response = await axios.put(
          `${process.env.USER_SERVICE_URL}/api/users/${user.id}`,
          { interests }
        );
        
        return response.data;
      } catch (error) {
        console.error('Error updating interests:', error);
        throw new Error('Failed to update interests');
      }
    },
  },
  
  Recommendation: {
    article: async (recommendation) => {
      try {
        const response = await axios.get(
          `${process.env.RECOMMENDATION_SERVICE_URL}/graphql`,
          {
            params: { query: `{ article(id: "${recommendation.articleId}") { id title abstract authors domain keywords publicationDate url } }` }
          }
        );
        
        return response.data.data.article;
      } catch (error) {
        console.error('Error fetching article for recommendation:', error);
        return null;
      }
    },
  },
};

module.exports = { typeDefs, resolvers };