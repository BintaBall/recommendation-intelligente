module.exports = {
  Query: {
    recommendedArticles: async (parent, { userId }, context) => {
      return [
        { id: '1', title: 'Article 1', abstract: 'Abstract 1', domain: 'Computer Science', score: 0.9 },
        { id: '2', title: 'Article 2', abstract: 'Abstract 2', domain: 'Physics', score: 0.8 }
      ];
    }
  }
};