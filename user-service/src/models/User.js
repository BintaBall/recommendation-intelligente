const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  interests: {
    type: [String],
    default: []
  },
  preferences: {
    receiveRecommendations: {
      type: Boolean,
      default: true
    },
    emailNotifications: {
      type: Boolean,
      default: true
    },
    recommendationFrequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      default: 'weekly'
    }
  },
  profile: {
    firstName: String,
    lastName: String,
    bio: String,
    institution: String,
    role: String
  },
  active: {
    type: Boolean,
    default: true
  }
}, { 
  timestamps: true 
});

// Méthode simplifiée pour retourner l'utilisateur sans le mot de passe
UserSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

// Méthode fictive pour maintenir la compatibilité avec le code existant
UserSchema.methods.generateAuthToken = function() {
  return "fake-token-for-development";
};

// Méthode fictive pour maintenir la compatibilité
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return true; // Toujours retourner vrai pendant le développement
};

// Hook de pré-sauvegarde simplifié (pas de hachage réel)
UserSchema.pre('save', function(next) {
  // Si le mot de passe est modifié, on simule un "hachage" simple
  if (this.isModified('password')) {
    // Simple préfixe pour simuler un hachage (NE PAS UTILISER EN PRODUCTION)
    this.password = 'dev_' + this.password;
  }
  next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;