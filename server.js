import { createApp } from './src/app.js';
import { testConnection } from './src/infrastructure/config/database.config.js';
import DatabaseInitializer from './src/infrastructure/database/DatabaseInitializer.js';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    console.log('🚀 Starting Kamino User Service...');
    
    // Test database connection
    await testConnection();
    
    // Initialize database (create tables if they don't exist)
    const dbInitializer = new DatabaseInitializer();
    await dbInitializer.initialize();
    
    // Create and start the Express app
    const app = createApp();
    
    app.listen(PORT, () => {
      console.log(`✅ Servidor corriendo en puerto ${PORT}`);
      console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📊 Base de datos inicializada correctamente`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();