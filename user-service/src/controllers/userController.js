const User = require('../models/User');

const userController = {
  // Récupérer l'utilisateur actuel - fonction simplifiée
  async getCurrentUser(req, res) {
    try {
      // Récupérer un utilisateur quelconque à titre d'exemple
      const user = await User.findOne();
      if (!user) {
        return res.status(404).json({ message: 'Aucun utilisateur trouvé' });
      }
      
      res.json({ user });
    } catch (error) {
      console.error('Erreur lors de la récupération du profil utilisateur :', error);
      res.status(500).json({ message: 'Échec de la récupération du profil utilisateur' });
    }
  },
  
  // Récupérer un utilisateur par ID - version sans vérification d'authentification
  async getUserById(req, res) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      
      res.json(user);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur par ID :', error);
      res.status(500).json({ message: 'Échec de la récupération de l\'utilisateur' });
    }
  },
  
  // Mettre à jour un utilisateur - version sans vérification d'authentification
  async updateUser(req, res) {
    try {
      // Trouve et met à jour l'utilisateur sans vérifier l'authentification
      const user = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      
      res.json({
        message: 'Utilisateur mis à jour avec succès',
        user
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur :', error);
      res.status(500).json({ message: 'Échec de la mise à jour de l\'utilisateur' });
    }
  },
  
  // Récupérer tous les utilisateurs
  async getAllUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      console.error('Erreur lors de la récupération de tous les utilisateurs :', error);
      res.status(500).json({ message: 'Échec de la récupération des utilisateurs' });
    }
  },
  
  // Supprimer un utilisateur - version sans vérification d'authentification
  async deleteUser(req, res) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      
      res.json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur :', error);
      res.status(500).json({ message: 'Échec de la suppression de l\'utilisateur' });
    }
  }
};

module.exports = userController;