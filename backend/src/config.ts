
// ============================================================
// FICHIER DE CONFIGURATION DES CONSTANTES
// config.ts
// ============================================================
// Ce fichier centralise toutes les configurations de l'application
// Avantages : maintenance facile, réutilisabilité, sécurité

import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();


// ============================================================
// VALIDATION DES VARIABLES D'ENVIRONNEMENT
// ============================================================
// Fonction pour valider qu'une variable d'environnement existe
function getEnvVariable(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  
  if (!value) {
    throw new Error(`❌ Variable d'environnement manquante: ${key}`);
  }
  
  return value;
}


// ============================================================
// CONFIGURATION DU SERVEUR
// ============================================================
export const SERVER_CONFIG = {
  // Port d'écoute du serveur
  PORT: parseInt(process.env.PORT || '5000', 10),
  
  // Environnement (development, production, test)
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Host du serveur
  HOST: process.env.HOST || 'localhost',
  
  // Version de l'API
  API_VERSION: process.env.API_VERSION || 'v1',
  
  // Préfixe des routes API
  API_PREFIX: process.env.API_PREFIX || '/api',
} as const;


// ============================================================
// CONFIGURATION DE L'APPLICATION
// ============================================================
export const APP_CONFIG = {
  NAME: process.env.APP_NAME || 'MyApp',
  DESCRIPTION: process.env.APP_DESCRIPTION || 'API pour gérer les utilisateurs et les rôles',
  VERSION: process.env.APP_VERSION || '1.0.0',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
} as const;


// ========================================
        // 3. On exécute la recherche sur le modèle User (Remplace 'User' par ton modèle)====================
// CONFIGURATION DE LA BASE DE DONNÉES
// ============================================================
export const DATABASE_CONFIG = {
  // URL de connexion à la base de données
  URL: process.env.DATABASE_URL || 'mongodb://localhost:27017/mydb',
  
  // Nom de la base de données
  NAME: process.env.DATABASE_NAME || 'mydb',
  
  // Options de connexion MongoDB
  MONGODB_OPTIONS: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
    minPoolSize: 2,
    socketTimeoutMS: 45000,
    serverSelectionTimeoutMS: 5000,
  },
  
  // Options de connexion PostgreSQL
  POSTGRES_OPTIONS: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    database: process.env.DATABASE_NAME || 'mydb',
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || '',
    max: 20, // Nombre maximum de connexions dans le pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  },
} as const;


// ============================================================
// CONFIGURATION DE LA SÉCURITÉ
// ============================================================
export const SECURITY_CONFIG = {
  // Origines CORS autorisées
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS?.split(',') || '*',

  // Méthodes HTTP autorisées
  ALLOWED_METHODS: process.env.ALLOWED_METHODS || '',

  // En-têtes autorisés
  ALLOWED_HEADERS: process.env.ALLOWED_HEADERS || '',

  // credentials (cookies) auto
        // 3. On exécute la recherche sur le modèle User (Remplace 'User' par ton modèle)risés  
  ALLOW_CREDENTIALS: process.env.ALLOW_CREDENTIALS === 'true',
  
        // 3. On exécute la recherche sur le modèle User (Remplace 'User' par ton modèle)
  // Clé secrète JWT
        // 3. On exécute la recherche sur le modèle User (Remplace 'User' par ton modèle)
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  
  // Durée de validité du token JWT
  JWT_ACCESS_EXPIRATION: process.env.JWT_ACCESS_EXPIRATION || '24h' ,
  
  JWT_REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION  || '7d',
  
  JWT_RESET_PASSWORD_EXPIRATION: process.env.JWT_RESET_PASSWORD_EXPIRATION || '1h',
  
  JWT_VERIFY_EMAIL_EXPIRATION: process.env.JWT_VERIFY_EMAIL_EXPIRATION || '24h',
  
  // Clé secrète pour les sessions
  SESSION_SECRET: process.env.SESSION_SECRET || 'session-secret-change-in-production',
  
  // Salt rounds pour le hash des mots de passe (bcrypt)
  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10),
  
  // Rate limiting
  RATE_LIMIT: {
    WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW || '15', 10) * 60 * 1000, // 15 minutes
    MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  },
} as const;


// ============================================================
// CONFIGURATION DES SERVICES EXTERNES
// ============================================================

export const EXTERNAL_SERVICES_CONFIG = {
  // Configuration email
  EMAIL: {
    HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
    PORT: parseInt(process.env.EMAIL_PORT || '587', 10),
    SECURE: process.env.EMAIL_SECURE === 'true',
    USER: process.env.EMAIL_USER || '',
    PASSWORD: process.env.EMAIL_PASSWORD || '',
    FROM: process.env.EMAIL_FROM || 'noreply@example.com',
  },

} as const;



// ici je suis



// ============================================================
// CONFIGURATION DES MIDDLEWARES
// ============================================================
export const MIDDLEWARE_CONFIG = {
  // Limite de taille du body
  BODY_LIMIT: process.env.BODY_LIMIT || '10mb',
  
  // Configuration de compression
  COMPRESSION: {
    level: 6, // Niveau de compression (0-9)
    threshold: 1024, // Taille minimum pour compresser (en bytes)
  },
  
  // Configuration Morgan (logging)
  MORGAN_FORMAT: SERVER_CONFIG.NODE_ENV === 'development' ? 'dev' : 'combined',
  
  // Configuration Helmet (sécurité headers)
  HELMET_OPTIONS: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
    crossOriginEmbedderPolicy: false,
  },
} as const;

// ============================================================
// CONFIGURATION DES SERVICES EXTERNES
// ============================================================
export const EXTERNAL_SERVICES = {
  
  // Configuration AWS S3
  AWS: {
    ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || '',
    SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
    REGION: process.env.AWS_REGION || 'us-east-1',
    S3_BUCKET: process.env.AWS_S3_BUCKET || '',
  },
  
  // Configuration Redis
  REDIS: {
    HOST: process.env.REDIS_HOST || 'localhost',
    PORT: parseInt(process.env.REDIS_PORT || '6379', 10),
    PASSWORD: process.env.REDIS_PASSWORD || '',
    DB: parseInt(process.env.REDIS_DB || '0', 10),
  },
  
  // Configuration API externes
  THIRD_PARTY_API: {
    BASE_URL: process.env.API_BASE_URL || '',
    API_KEY: process.env.API_KEY || '',
    TIMEOUT: parseInt(process.env.API_TIMEOUT || '5000', 10),
  },

  // Twilio Configuration
  TWILIO: {
    ACCOUNT_SID: getEnvVariable('TWILIO_ACCOUNT_SID', 'your-twilio-account-sid'),
    AUTH_TOKEN: getEnvVariable('TWILIO_AUTH_TOKEN', 'your-twilio-auth-token'),
    PHONE_NUMBER: getEnvVariable('TWILIO_PHONE_NUMBER', '+1234567890'),
  },
} as const;

// ============================================================
// CONFIGURATION DES LOGS
// ============================================================
export const LOGGING_CONFIG = {
  // Niveau de log (error, warn, info, debug)
  LEVEL: process.env.LOG_LEVEL || 'info',
  
  // Répertoire des logs
  DIR: process.env.LOG_DIR || './logs',
  
  // Taille maximale d'un fichier log
  MAX_SIZE: process.env.LOG_MAX_SIZE || '20m',
  
  // Nombre maximum de fichiers log à conserver
  MAX_FILES: process.env.LOG_MAX_FILES || '14d',
  
  // Format des logs
  FORMAT: SERVER_CONFIG.NODE_ENV === 'production' ? 'json' : 'simple',
} as const;

// ============================================================
// CONFIGURATION DES UPLOADS
// ============================================================
export const UPLOAD_CONFIG = {
  // Répertoire de stockage des uploads
  DESTINATION: process.env.UPLOAD_DIR || './uploads',
  
  // Taille maximale d'un fichier (en bytes)
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB par défaut
  
  // Types de fichiers autorisés
  ALLOWED_MIME_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
} as const;

// ============================================================
// CONFIGURATION DES TIMEOUTS
// ============================================================
export const TIMEOUT_CONFIG = {
  // Timeout des requêtes HTTP (en ms)
  HTTP_REQUEST: parseInt(process.env.HTTP_TIMEOUT || '30000', 10),
  
  // Timeout de la base de données (en ms)
  DATABASE: parseInt(process.env.DB_TIMEOUT || '5000', 10),
  
  // Timeout des services externes (en ms)
  EXTERNAL_SERVICE: parseInt(process.env.EXTERNAL_TIMEOUT || '10000', 10),
} as const;

// ============================================================
// CONFIGURATION DE LA PAGINATION
// ============================================================
export const PAGINATION_CONFIG = {
  // Limite par défaut
  DEFAULT_LIMIT: parseInt(process.env.DEFAULT_PAGE_LIMIT || '20', 10),
  
  // Limite maximale
  MAX_LIMIT: parseInt(process.env.MAX_PAGE_LIMIT || '100', 10),
  
  // Page par défaut
  DEFAULT_PAGE: 1,
} as const;

// ============================================================
// MESSAGES D'ERREUR PERSONNALISÉS
// ============================================================
export const ERROR_MESSAGES = {
  SERVER_ERROR: 'Une erreur interne du serveur s\'est produite',
  NOT_FOUND: 'Ressource non trouvée',
  UNAUTHORIZED: 'Non autorisé',
  FORBIDDEN: 'Accès interdit',
  BAD_REQUEST: 'Requête invalide',
  VALIDATION_ERROR: 'Erreur de validation des données',
  DATABASE_ERROR: 'Erreur de base de données',
  AUTHENTICATION_FAILED: 'Échec de l\'authentification',
  TOKEN_EXPIRED: 'Token expiré',
  RATE_LIMIT_EXCEEDED: 'Trop de requêtes, veuillez réessayer plus tard',
} as const;

// ============================================================
// CONFIGURATION DES FEATURES FLAGS
// ============================================================
export const FEATURE_FLAGS = {
  // Activer/désactiver certaines fonctionnalités
  ENABLE_SWAGGER: process.env.ENABLE_SWAGGER === 'true',
  ENABLE_GRAPHQL: process.env.ENABLE_GRAPHQL === 'true',
  ENABLE_WEBSOCKET: process.env.ENABLE_WEBSOCKET === 'true',
  ENABLE_CACHE: process.env.ENABLE_CACHE === 'true',
  ENABLE_MONITORING: process.env.ENABLE_MONITORING === 'true',
} as const;

// ============================================================
// CONFIGURATION DES BONUS
// ============================================================
export const BONUS = {
  REFERRAL: parseFloat(process.env.BONUS_REFERRAL || '7'), // Bonus pour le parrain
  FIEUL: parseFloat(process.env.BONUS_FIEULS || '3'),   // Bonus pour le filleul
} as const;

// ============================================================
// HELPER: Vérifier si on est en production
// ============================================================
export const isProduction = (): boolean => {
  return SERVER_CONFIG.NODE_ENV === 'production';
};

// ============================================================
// HELPER: Vérifier si on est en développement
// ============================================================
export const isDevelopment = (): boolean => {
  return SERVER_CONFIG.NODE_ENV === 'development';
};

// ============================================================
// HELPER: Vérifier si on est en test
// ============================================================
export const isTest = (): boolean => {
  return SERVER_CONFIG.NODE_ENV === 'test';
};

// ============================================================
// EXPORT DE L'URL COMPLÈTE DU SERVEUR
// ============================================================
export const getServerUrl = (): string => {
  return `http://${SERVER_CONFIG.HOST}:${SERVER_CONFIG.PORT}`;
};

// ============================================================
// EXPORT DE L'URL COMPLÈTE DE L'API
// ============================================================
export const getApiUrl = (): string => {
  return `${getServerUrl()}${SERVER_CONFIG.API_PREFIX}/${SERVER_CONFIG.API_VERSION}`;
};

// ============================================================
// VALIDATION DE LA CONFIGURATION AU DÉMARRAGE
// ============================================================
export function validateConfig(): void {
  console.log('🔍 Validation de la configuration...');
  
  // Vérifier les variables critiques en production
  if (isProduction()) {
    if (SECURITY_CONFIG.JWT_SECRET === 'your-secret-key-change-in-production') {
      throw new Error('❌ JWT_SECRET doit être défini en production');
    }
    
    if (SECURITY_CONFIG.SESSION_SECRET === 'session-secret-change-in-production') {
      throw new Error('❌ SESSION_SECRET doit être défini en production');
    }
  }
  
  console.log('✅ Configuration validée avec succès');
}


// Export par défaut de toute la configuration
export default {
  SERVER: SERVER_CONFIG,
  DATABASE: DATABASE_CONFIG,
  APP: APP_CONFIG,


  SECURITY: SECURITY_CONFIG,
  MIDDLEWARE: MIDDLEWARE_CONFIG,
  EXTERNAL_SERVICES: EXTERNAL_SERVICES_CONFIG,
  LOGGING: LOGGING_CONFIG,
  UPLOAD: UPLOAD_CONFIG,
  TIMEOUT: TIMEOUT_CONFIG,
  PAGINATION: PAGINATION_CONFIG,
  BONUS,
  ERROR_MESSAGES,
  FEATURE_FLAGS,
  isProduction,
  isDevelopment,
  isTest,
  getServerUrl,
  getApiUrl,
  validateConfig,
};
