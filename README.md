# Plateforme Intelligente de Recommandation d'Articles Scientifiques

## Projet éducatif - Polytechnique Sousse
**Auteur**: Binta Ball  
**Classe**: 4ème DS4  
**École**: Polytechnique Sousse

Cette plateforme est une application backend en microservices qui recommande automatiquement des articles de recherche pertinents aux utilisateurs, en fonction de leurs centres d'intérêt, de leur historique de consultation, et de l'analyse sémantique des publications.

## Architecture

La plateforme est constituée de 5 microservices principaux, avec une architecture événementielle basée sur Kafka :

### Microservices

1. **Service Utilisateur** (REST API)
   - Gestion des profils utilisateurs
   - Authentification et génération de JWT
   - Stockage des préférences et centres d'intérêt

2. **Service Article** (gRPC)
   - Gestion des articles scientifiques
   - Analyse sémantique du contenu
   - Classification par domaine et mots-clés

3. **Service Recommandation** (GraphQL)
   - Algorithme de recommandation personnalisée
   - Point d'entrée GraphQL pour des requêtes flexibles
   - Analyse des préférences utilisateur

4. **Service Événement** (Kafka)
   - Capture et traitement des événements utilisateur
   - Production et consommation de messages Kafka
   - Analyse comportementale

5. **API Gateway**
   - Point d'entrée unique pour les clients
   - Routage des requêtes vers les services appropriés
   - Agrégation des réponses de plusieurs services

## Prérequis

- Docker et Docker Compose
- Node.js (pour le développement local)
- Git

## Installation et Démarrage

### Cloner le dépôt

```bash
git clone https://github.com/BintaBall/recommendation-intelligente.git
cd recommendation-intelligente
```

### Lancement de la plateforme complète

```bash
# Lancer tous les services avec Docker Compose
docker-compose up -d

# Vérifier l'état des conteneurs
docker-compose ps
```

### Lancement des services individuellement

#### 1. Démarrer MongoDB

```bash
docker-compose up -d mongodb
```

#### 2. Démarrer Kafka et Zookeeper

```bash
cd kafka
docker-compose up -d
cd ..
```

#### 3. Démarrer le service utilisateur

```bash
cd user-service
npm install
npm start
# Ou avec Docker
docker-compose up -d user-service
```

#### 4. Démarrer le service article

```bash
cd article-service
npm install
npm start
# Ou avec Docker
docker-compose up -d article-service
```

#### 5. Démarrer le service recommandation

```bash
cd recommendation-service
npm install
npm start
# Ou avec Docker
docker-compose up -d recommendation-service
```

#### 6. Démarrer le service événement

```bash
cd event-service
npm install
npm start
# Ou avec Docker
docker-compose up -d event-service
```

#### 7. Démarrer l'API Gateway

```bash
cd api-gateway
npm install
npm start
# Ou avec Docker
docker-compose up -d api-gateway
```

## Initialisation de la base de données

Pour initialiser la base de données avec un ensemble de 50 articles scientifiques de différents domaines :

#### Option 1: Exécuter localement

Si MongoDB est déjà en cours d'exécution (via votre docker-compose), vous pouvez exécuter directement :

```bash
cd article-service
# Installer les dépendances si ce n'est pas déjà fait
npm install mongoose dotenv
# Exécuter le script
node src/seed.js
```

#### Option 2: Exécuter depuis un conteneur Docker

Si vous préférez exécuter le script à partir d'un conteneur Docker (ce qui garantit l'accès au réseau Docker) :

```bash
# Assurez-vous que le conteneur article-service est en cours d'exécution
docker-compose up -d article-service mongodb

# Exécuter le script à l'intérieur du conteneur
docker exec -it article-service node src/seed.js
```

#### Option 3: Script shell pour faciliter le processus

Créez un script shell dans votre projet pour faciliter l'initialisation :

```bash
# Fichier: seed-db.sh
#!/bin/bash
echo "Initializing database with sample articles..."

# S'assurer que les services nécessaires sont en cours d'exécution
docker-compose up -d mongodb

# Attendre que MongoDB soit prêt
sleep 5

# Exécuter le script de seed
cd article-service && node src/seed.js

echo "Database initialization complete!"
```

Rendez-le exécutable :
```bash
chmod +x seed-db.sh
```

Puis exécutez-le :
```bash
./seed-db.sh
```

### 3. Vérifier les données

Pour vérifier que les articles ont bien été insérés, vous pouvez utiliser MongoDB Compass ou un autre client MongoDB, ou encore exécuter une commande comme celle-ci :

```bash
docker exec -it mongodb mongosh --eval "use articles-platform; db.articles.find().count()"
```

## Endpoints API

### API Gateway

- URL: `http://localhost:4000`

### Service Utilisateur

- URL: `http://localhost:4001`
- Endpoints:
  - `POST /users` - Créer un nouvel utilisateur
  - `GET /users/:id` - Obtenir les détails d'un utilisateur
  - `PUT /users/:id` - Mettre à jour un utilisateur
  - `POST /auth/login` - Authentifier un utilisateur

### Service Article

- URL: `http://localhost:5000` (gRPC, non accessible via navigateur)

### Service Recommandation (GraphQL)

- URL: `http://localhost:4003/graphql`
- Queries:
  ```graphql
  query {
    recommendedArticles(userId: "user_id_here") {
      id
      title
      domain
      content
    }
  }
  ```

### Service Événement

- URL: `http://localhost:4002`
- Ce service consomme et produit des messages Kafka (pas d'API REST exposée directement)

## Structure des Topics Kafka

- `user-events` - Événements liés aux utilisateurs
- `article-events` - Événements liés aux articles
- `reco-feedback` - Feedback sur les recommandations

## Configuration Kafka

- Broker Kafka: `kafka:9080`
- Zookeeper: `zookeeper:2181`

## Schémas de Données

### Utilisateur
```json
{
  "_id": "string",
  "email": "string",
  "password": "string (hashed)",
  "preferences": ["string"],
  "createdAt": "date",
  "updatedAt": "date"
}
```

### Article
```json
{
  "id": "string",
  "title": "string",
  "domain": "string",
  "content": "string"
}
```

## Monitoring et Logs

Pour accéder aux logs des services :

```bash
# Logs du service utilisateur
docker logs user-service-1

# Logs du service article
docker logs article-service-1

# Logs du service recommandation
docker logs recommendation-service-1

# Logs du service événement
docker logs event-service-1

# Logs de l'API Gateway
docker logs api-gateway-1
```

## Structure du Projet

```
recommendation-intelligente/
├── api-gateway/              # Point d'entrée REST + GraphQL (Port 4000)
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       └── server.js
│
├── user-service/             # Microservice REST (Port 4001)
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── controllers/
│       ├── models/
│       ├── routes/
│       └── index.js
│
├── article-service/          # Microservice gRPC (Port 5000)
│   ├── Dockerfile
│   ├── proto/
│   │   └── article.proto
│   ├── src/
│   │   ├── models/
│   │   ├── seed.js
│   │   └── index.js
│
├── recommendation-service/   # Microservice GraphQL (Port 4003)
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── schema/
│       │   └── typeDefs.js
│       ├── resolvers/
│       └── server.js
│
├── event-service/            # Kafka producer/consumer (Port 4002)
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       └── index.js
│
├── kafka/                    # Docker Compose config pour Kafka
│   └── docker-compose.yml
│
└── docker-compose.yml        # Orchestration multi-services
```

## Objectifs Pédagogiques

Ce projet a été développé dans le cadre d'une formation en data science pour démontrer:

- Les patterns d'architecture microservices
- L'utilisation de différents protocoles de communication
- L'architecture événementielle avec Kafka
- La conteneurisation avec Docker
- L'orchestration de services avec Docker Compose

