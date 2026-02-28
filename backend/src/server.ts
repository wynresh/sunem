import { connect } from "./database";
import config from "./config";
import server from './app';


// ============================================================
// GESTION DE L'ARRÊT GRACIEUX
// ============================================================
function gracefulShutdown(signal: string) {
    console.log(`\n${signal} reçu. Arrêt gracieux du serveur...`);

    server.close(() => {
        console.log('✅ Serveur HTTP fermé');
        process.exit(0);
    });
  
    setTimeout(() => {
        console.error('❌ Arrêt forcé du serveur');
        process.exit(1);
    }, 10000);
}



// ============================================================
// DÉMARRAGE DU SERVEUR
// ============================================================

async function startServer() {
    try {
        await connect();
    
        // ✅ IMPORTANT : Utiliser httpServer.listen() au lieu de app.listen()
        server.listen(config.SERVER.PORT, () => {
            console.log('='.repeat(50));
            console.log(`🚀 Serveur démarré avec succès`);
            console.log(`📍 Environnement: ${config.SERVER.NODE_ENV}`);
            console.log(`🌐 URL: ${config.getServerUrl()}`);
            console.log(`🔌 WebSocket: Socket.io activé`);
            console.log(`📡 API: ${config.SERVER.API_PREFIX}/${config.SERVER.API_VERSION}`);
            console.log(`⏰ Démarré à: ${new Date().toLocaleString('fr-FR')}`);
            console.log('='.repeat(50));
        });
    
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    
        process.on('unhandledRejection', (reason: any) => {
            console.error('❌ Promesse rejetée non gérée:', reason);
            gracefulShutdown('unhandledRejection');
        });
    
        process.on('uncaughtException', (error: Error) => {
            console.error('❌ Exception non capturée:', error);
            gracefulShutdown('uncaughtException');
        });
    
    } catch (error) {
        console.error('❌ Erreur lors du démarrage du serveur:', error);
        process.exit(1);
    }
}


// Lancer le serveur
startServer();
