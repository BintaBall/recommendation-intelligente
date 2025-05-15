require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sequelize } = require('./models');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Importer le routeur centralisé
const routes = require('./routes'); 

// Monter toutes les routes sous /api
app.use('/api', routes);

// Test route racine
app.get('/', (req, res) => {
  res.send('User Service is running');
});

// Synchronisation de la DB et lancement du serveur
const PORT = process.env.PORT || 4001;
sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`User Service running on port ${PORT}`);
  });
});