#!/usr/bin/env node

import dotenv from 'dotenv';
import DatabaseInitializer from '../DatabaseInitializer.js';

// Load environment variables
dotenv.config();

async function migrateDatabase() {
    const dbInitializer = new DatabaseInitializer();
    
    try {
        console.log('🔄 Starting database migration...');
        
        // Test connection first
        await dbInitializer.testConnection();
        
        // Sync models with alter: true to update existing tables
        console.log('📊 Synchronizing database models...');
        await dbInitializer.syncModels();
        
        console.log('✅ Database migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Database migration failed:', error.message);
        process.exit(1);
    } finally {
        await dbInitializer.close();
    }
}

// Run the migration
migrateDatabase();