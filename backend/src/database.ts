// ============================================================
// CONFIGURATION DE LA BASE DE DONNÉES MONGODB
// src/database.ts
// ============================================================
import mongoose from 'mongoose';
import config from '@/config';


// ============================================================
// CONNEXION À MONGODB
// ============================================================
export async function connect(): Promise<void> {
    try {
        console.log('🔄 Connexion à MongoDB en cours...');
    
        // Connexion à MongoDB
        await mongoose.connect(config.DATABASE.URL, config.DATABASE.MONGODB_OPTIONS);
    
        console.log('✅ Connexion à MongoDB réussie');
        console.log(`🌐 Host: ${mongoose.connection.host}`);
    
        // Log supplémentaire en développement
        if (config.isDevelopment()) {
            mongoose.set('debug', true); // Active les logs de requêtes Mongoose
        }
    
    } catch (error: any) {
        console.error('❌ Erreur de connexion à MongoDB:', error.message);
        console.error('Détails:', error);
        process.exit(1); // Arrêter l'application si la connexion échoue
    }
}


// ============================================================
// DÉCONNEXION DE MONGODB
// ============================================================
export async function disconnect(): Promise<void> {
    try {
        await mongoose.connection.close();
        console.log('✅ Déconnexion de MongoDB réussie');
    } catch (error: any) {
        console.error('❌ Erreur lors de la déconnexion de MongoDB:', error.message);
    }
}


// ============================================================
// GESTION DES ÉVÉNEMENTS DE CONNEXION
// ============================================================

// Événement: Connexion établie
mongoose.connection.on('connected', () => {
  console.log('🟢 Mongoose connecté à MongoDB');
});

// Événement: Erreur de connexion
mongoose.connection.on('error', (err) => {
  console.error('❌ Erreur de connexion Mongoose:', err);
});

// Événement: Déconnexion
mongoose.connection.on('disconnected', () => {
  console.log('🔴 Mongoose déconnecté de MongoDB');
});

// Événement: Reconnexion
mongoose.connection.on('reconnected', () => {
  console.log('🟡 Mongoose reconnecté à MongoDB');
});


// ============================================================
// GESTION DE L'ARRÊT GRACIEUX
// ============================================================
// Fermer la connexion proprement lors de l'arrêt de l'application
process.on('SIGINT', async () => {
  await disconnect();
  process.exit(0);
});


// ============================================================
// VÉRIFIER L'ÉTAT DE LA CONNEXION
// ============================================================
export function isConnected(): boolean {
  return mongoose.connection.readyState === 1;
}


// ============================================================
// OBTENIR LES STATISTIQUES DE LA BASE DE DONNÉES
// ============================================================
export async function getDatabaseStats() {
  try {
    if (!isConnected() || !mongoose.connection.db) {
      return { error: 'Base de données non connectée' };
    }
    
    const db = mongoose.connection.db;
    const stats = await db.stats();
    
    return {
      database: db.databaseName,
      collections: stats.collections,
      dataSize: `${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`,
      indexSize: `${(stats.indexSize / 1024 / 1024).toFixed(2)} MB`,
      objects: stats.objects,
    };
  } catch (error: any) {
    console.error('Erreur lors de la récupération des stats:', error);
    return { error: error.message };
  }
}
