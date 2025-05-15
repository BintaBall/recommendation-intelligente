const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  abstract: {
    type: String,
    required: true,
  },
  authors: {
    type: [String],
    required: true,
    default: []
  },
  domain: {
    type: String,
    required: true,
    index: true
  },
  keywords: {
    type: [String],
    default: [],
    index: true
  },
  publicationDate: {
    type: Date,
    default: Date.now
  },
  content: {
    type: String,
    required: true
  },
  url: {
    type: String,
    trim: true
  },
  semanticData: {
    termFrequency: {
      type: Map,
      of: Number,
      default: {}
    },
    extractedKeywords: {
      type: [String],
      default: []
    },
    entities: [
      {
        name: String,
        type: String,
        relevance: Number
      }
    ],
    readabilityScore: {
      type: Number,
      default: 0
    },
    relatedDomains: {
      type: [String],
      default: []
    },
    analyzedAt: {
      type: Date,
      default: null
    }
  },
  metadata: {
    citations: {
      type: Number,
      default: 0
    },
    references: {
      type: [String],
      default: []
    },
    doi: {
      type: String,
      trim: true
    },
    journal: {
      type: String,
      trim: true
    },
    viewCount: {
      type: Number,
      default: 0
    }
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Text indexes for full-text search
ArticleSchema.index(
  { title: 'text', abstract: 'text', content: 'text', keywords: 'text' },
  { weights: { title: 10, abstract: 5, keywords: 3, content: 1 } }
);

// Method to increment view count
ArticleSchema.methods.incrementViewCount = async function() {
  this.metadata.viewCount += 1;
  return this.save();
};

// Method to convert to format needed for gRPC response
ArticleSchema.methods.toGrpcResponse = function() {
  return {
    id: this._id.toString(),
    title: this.title,
    abstract: this.abstract,
    authors: this.authors,
    domain: this.domain,
    keywords: this.keywords,
    publication_date: this.publicationDate.toISOString(),
    content: this.content,
    url: this.url || '',
    created_at: this.createdAt.toISOString(),
    updated_at: this.updatedAt.toISOString()
  };
};

// Method to convert to format needed for analysis gRPC response
ArticleSchema.methods.toAnalysisResponse = function() {
  // Convert Map to regular object for gRPC
  const termFrequencies = {};
  if (this.semanticData.termFrequency) {
    for (const [key, value] of this.semanticData.termFrequency.entries()) {
      termFrequencies[key] = value;
    }
  }

  return {
    id: this._id.toString(),
    extracted_keywords: this.semanticData.extractedKeywords || [],
    entities: (this.semanticData.entities || []).map(entity => ({
      name: entity.name,
      type: entity.type,
      relevance: entity.relevance
    })),
    term_frequencies: termFrequencies,
    related_domains: this.semanticData.relatedDomains || [],
    readability_score: this.semanticData.readabilityScore || 0
  };
};

const Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;