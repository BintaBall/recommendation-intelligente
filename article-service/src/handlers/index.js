const Article = require('../models/Article');
const { analyzeText } = require('../utils/textAnalysis');
const { publishEvent } = require('../utils/kafka');

// Constantes pour les événements Kafka
const ARTICLE_EVENTS = {
  CREATED: 'article.created',
  VIEWED: 'article.viewed',
  SEARCHED: 'article.searched'
};

// Implémentations des gestionnaires 
module.exports = {
  // Récupérer un seul article par ID
  async getArticle(call, callback, { producer, logger }) {
    try {
      const { id } = call.request;
      
      if (!id) {
        return callback({
          code: 3, // ARGUMENT_INVALIDE
          message: "L'ID de l'article est requis"
        });
      }
      
      const article = await Article.findById(id);
      
      if (!article) {
        return callback({
          code: 5, // NON_TROUVÉ
          message: "Article non trouvé"
        });
      }
      
      // Incrémenter le compteur de vues
      await article.incrementViewCount();
      
      // Publier un événement de visualisation d'article
      publishEvent(producer, ARTICLE_EVENTS.VIEWED, {
        articleId: article._id.toString(),
        title: article.title,
        domain: article.domain,
        timestamp: new Date().toISOString()
      }).catch(err => {
        logger.error("Échec de la publication de l'événement de visualisation d'article", err);
      });
      
      // Renvoyer les données de l'article
      callback(null, article.toGrpcResponse());
    } catch (error) {
      logger.error('Erreur dans le gestionnaire getArticle:', error);
      callback({
        code: 13, // ERREUR_INTERNE
        message: 'Erreur interne du serveur'
      });
    }
  },
  
  // Rechercher des articles en fonction de la requête
  async searchArticles(call, callback, { producer, logger }) {
    try {
      const { query, limit = 10, offset = 0 } = call.request;
      
      if (!query) {
        return callback({
          code: 3, // ARGUMENT_INVALIDE
          message: 'La requête de recherche est requise'
        });
      }
      
      // Utiliser la recherche textuelle de MongoDB
      const articles = await Article.find(
        { $text: { $search: query } },
        { score: { $meta: 'textScore' } }
      )
        .sort({ score: { $meta: 'textScore' } })
        .skip(offset)
        .limit(limit);
      
      const totalCount = await Article.countDocuments({ $text: { $search: query } });
      
      // Publier un événement de recherche
      publishEvent(producer, ARTICLE_EVENTS.SEARCHED, {
        query,
        resultCount: articles.length,
        timestamp: new Date().toISOString()
      }).catch(err => {
        logger.error("Échec de la publication de l'événement de recherche d'article", err);
      });
      
      // Convertir au format gRPC
      const response = {
        articles: articles.map(article => article.toGrpcResponse()),
        total_count: totalCount
      };
      
      callback(null, response);
    } catch (error) {
      logger.error('Erreur dans le gestionnaire searchArticles:', error);
      callback({
        code: 13, // ERREUR_INTERNE
        message: 'Erreur interne du serveur'
      });
    }
  },
  
  // Récupérer tous les articles avec pagination optionnelle
  async listArticles(call, callback, { logger }) {
    try {
      const { limit = 10, offset = 0, sort_by = 'createdAt', descending = true } = call.request;
      
      // Construire l'objet de tri
      const sortOrder = descending ? -1 : 1;
      const sortOptions = {};
      sortOptions[sort_by] = sortOrder;
      
      const articles = await Article.find({ active: true })
        .sort(sortOptions)
        .skip(offset)
        .limit(limit);
      
      const totalCount = await Article.countDocuments({ active: true });
      
      // Convertir au format gRPC
      const response = {
        articles: articles.map(article => article.toGrpcResponse()),
        total_count: totalCount
      };
      
      callback(null, response);
    } catch (error) {
      logger.error('Erreur dans le gestionnaire listArticles:', error);
      callback({
        code: 13, // ERREUR_INTERNE
        message: 'Erreur interne du serveur'
      });
    }
  },
  
  // Créer un nouvel article
  async createArticle(call, callback, { producer, logger }) {
    try {
      const {
        title,
        abstract,
        authors,
        domain,
        keywords,
        publication_date,
        content,
        url
      } = call.request;
      
      // Valider les champs obligatoires
      if (!title || !abstract || !authors || !domain || !content) {
        return callback({
          code: 3, // ARGUMENT_INVALIDE
          message: 'Champs obligatoires manquants'
        });
      }
      
      // Créer l'instance d'article
      const article = new Article({
        title,
        abstract,
        authors,
        domain,
        keywords,
        publicationDate: publication_date ? new Date(publication_date) : new Date(),
        content,
        url
      });
      
      // Sauvegarder l'article
      await article.save();
      
      // Analyser le contenu de manière asynchrone (sans attendre)
      analyzeText(article).catch(err => {
        logger.error(`Échec de l'analyse du texte de l'article: ${article._id}`, err);
      });
      
      // Publier un événement de création d'article
      publishEvent(producer, ARTICLE_EVENTS.CREATED, {
        articleId: article._id.toString(),
        title: article.title,
        domain: article.domain,
        keywords: article.keywords,
        timestamp: new Date().toISOString()
      }).catch(err => {
        logger.error("Échec de la publication de l'événement de création d'article", err);
      });
      
      // Renvoyer l'article créé
      callback(null, article.toGrpcResponse());
    } catch (error) {
      logger.error('Erreur dans le gestionnaire createArticle:', error);
      callback({
        code: 13, // ERREUR_INTERNE
        message: 'Erreur interne du serveur'
      });
    }
  },
  
  // Obtenir des articles similaires pour un ID d'article donné
  async getSimilarArticles(call, callback, { logger }) {
    try {
      const { id, limit = 5 } = call.request;
      
      if (!id) {
        return callback({
          code: 3, // ARGUMENT_INVALIDE
          message: "L'ID de l'article est requis"
        });
      }
      
      // Trouver l'article source
      const sourceArticle = await Article.findById(id);
      
      if (!sourceArticle) {
        return callback({
          code: 5, // NON_TROUVÉ
          message: "Article source non trouvé"
        });
      }
      
      // Trouver des articles similaires basés sur le domaine et les mots-clés
      const similarArticles = await Article.find({
        _id: { $ne: sourceArticle._id },
        $or: [
          { domain: sourceArticle.domain },
          { keywords: { $in: sourceArticle.keywords } }
        ]
      })
        .limit(limit);
      
      // Convertir au format gRPC
      const response = {
        articles: similarArticles.map(article => article.toGrpcResponse()),
        total_count: similarArticles.length
      };
      
      callback(null, response);
    } catch (error) {
      logger.error('Erreur dans le gestionnaire getSimilarArticles:', error);
      callback({
        code: 13, // ERREUR_INTERNE
        message: 'Erreur interne du serveur'
      });
    }
  },
  
  // Obtenir des articles par domaine
  async getArticlesByDomain(call, callback, { logger }) {
    try {
      const { domain, limit = 10, offset = 0 } = call.request;
      
      if (!domain) {
        return callback({
          code: 3, // ARGUMENT_INVALIDE
          message: 'Le domaine est requis'
        });
      }
      
      const articles = await Article.find({ domain })
        .sort({ publicationDate: -1 })
        .skip(offset)
        .limit(limit);
      
      const totalCount = await Article.countDocuments({ domain });
      
      // Convertir au format gRPC
      const response = {
        articles: articles.map(article => article.toGrpcResponse()),
        total_count: totalCount
      };
      
      callback(null, response);
    } catch (error) {
      logger.error('Erreur dans le gestionnaire getArticlesByDomain:', error);
      callback({
        code: 13, // ERREUR_INTERNE
        message: 'Erreur interne du serveur'
      });
    }
  },
  
  // Obtenir des articles par liste de mots-clés
  async getArticlesByKeywords(call, callback, { logger }) {
    try {
      const { keywords, limit = 10, offset = 0 } = call.request;
      
      if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
        return callback({
          code: 3, // ARGUMENT_INVALIDE
          message: 'Au moins un mot-clé est requis'
        });
      }
      
      const articles = await Article.find({ keywords: { $in: keywords } })
        .sort({ publicationDate: -1 })
        .skip(offset)
        .limit(limit);
      
      const totalCount = await Article.countDocuments({ keywords: { $in: keywords } });
      
      // Convertir au format gRPC
      const response = {
        articles: articles.map(article => article.toGrpcResponse()),
        total_count: totalCount
      };
      
      callback(null, response);
    } catch (error) {
      logger.error('Erreur dans le gestionnaire getArticlesByKeywords:', error);
      callback({
        code: 13, // ERREUR_INTERNE
        message: 'Erreur interne du serveur'
      });
    }
  },
  
  // Obtenir l'analyse du contenu d'un article
  async analyzeArticleContent(call, callback, { logger }) {
    try {
      const { id } = call.request;
      
      if (!id) {
        return callback({
          code: 3, // ARGUMENT_INVALIDE
          message: "L'ID de l'article est requis"
        });
      }
      
      // Trouver l'article
      const article = await Article.findById(id);
      
      if (!article) {
        return callback({
          code: 5, // NON_TROUVÉ
          message: "Article non trouvé"
        });
      }
      
      // Si pas encore analysé, le faire maintenant
      if (!article.semanticData.analyzedAt) {
        await analyzeText(article);
      }
      
      // Renvoyer l'analyse
      callback(null, article.toAnalysisResponse());
    } catch (error) {
      logger.error('Erreur dans le gestionnaire analyzeArticleContent:', error);
      callback({
        code: 13, // ERREUR_INTERNE
        message: 'Erreur interne du serveur'
      });
    }
  }
};