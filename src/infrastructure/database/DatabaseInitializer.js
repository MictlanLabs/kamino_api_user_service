import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import sequelize from '../config/sequelize.config.js';
import { UserModel, RefreshTokenModel } from '../models/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DatabaseInitializer {
    constructor() {
        this.sequelize = sequelize;
        this.models = { UserModel, RefreshTokenModel };
    }

    /**
     * Initialize the database by creating tables and running initial setup
     */
    async initialize() {
        try {
            console.log('Starting database initialization...');
            
            // Test database connection
            await this.testConnection();
            
            // Sync models (create tables if they don't exist)
            await this.syncModels();
            
            // Run SQL initialization script for additional setup
            await this.runInitializationScript();
            
            console.log('Database initialization completed successfully');
            return true;
        } catch (error) {
            console.error('Database initialization failed:', error);
            throw error;
        }
    }

    /**
     * Test database connection
     */
    async testConnection() {
        try {
            await this.sequelize.authenticate();
            console.log('Database connection established successfully');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
            throw error;
        }
    }

    /**
     * Sync Sequelize models to create tables
     */
    async syncModels() {
        try {
            console.log('Synchronizing database models...');
            
            // Use alter: true in development to update existing tables
            // Use force: false to avoid dropping existing data
            const syncOptions = {
                alter: process.env.NODE_ENV === 'development',
                force: false
            };
            
            await this.sequelize.sync(syncOptions);
            console.log('Database models synchronized successfully');
        } catch (error) {
            console.error('Model synchronization failed:', error);
            throw error;
        }
    }

    /**
     * Run SQL initialization script for additional database setup
     */
    async runInitializationScript() {
        try {
            console.log('Running database initialization script...');
            
            const scriptPath = path.join(__dirname, 'init.sql');
            const sqlScript = await fs.readFile(scriptPath, 'utf8');
            await this.sequelize.query(sqlScript);
            
            console.log('Database initialization script executed successfully');
        } catch (error) {
            console.error('Failed to run initialization script:', error);
            // Don't throw here as the models sync might be sufficient
            console.warn('Continuing without initialization script...');
        }
    }

    /**
     * Drop all tables (use with caution)
     */
    async dropTables() {
        try {
            console.log('Dropping all tables...');
            await this.sequelize.drop();
            console.log('All tables dropped successfully');
        } catch (error) {
            console.error('Failed to drop tables:', error);
            throw error;
        }
    }

    /**
     * Reset database (drop and recreate)
     */
    async reset() {
        try {
            console.log('Resetting database...');
            await this.dropTables();
            await this.initialize();
            console.log('Database reset completed successfully');
        } catch (error) {
            console.error('Database reset failed:', error);
            throw error;
        }
    }

    /**
     * Close database connection
     */
    async close() {
        try {
            await this.sequelize.close();
            console.log('Database connection closed');
        } catch (error) {
            console.error('Failed to close database connection:', error);
        }
    }
}

export default DatabaseInitializer;
