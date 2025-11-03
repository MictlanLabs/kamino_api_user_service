#!/usr/bin/env node

import dotenv from 'dotenv';
import DatabaseInitializer from '../DatabaseInitializer.js';

// Load environment variables
dotenv.config();

async function initializeDatabase() {
    const dbInitializer = new DatabaseInitializer();
    
    try {
        console.log('🚀 Starting database initialization...');
        await dbInitializer.initialize();
        console.log('✅ Database initialization completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Database initialization failed:', error.message);
        process.exit(1);
    } finally {
        await dbInitializer.close();
    }
}

// Run the initialization
initializeDatabase();