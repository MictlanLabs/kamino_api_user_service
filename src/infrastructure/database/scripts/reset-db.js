#!/usr/bin/env node

import dotenv from 'dotenv';
import DatabaseInitializer from '../DatabaseInitializer.js';

// Load environment variables
dotenv.config();

async function resetDatabase() {
    const dbInitializer = new DatabaseInitializer();
    
    try {
        console.log('🔄 Starting database reset...');
        console.log('⚠️  WARNING: This will drop all existing tables and data!');
        
        // In production, you might want to add a confirmation prompt here
        if (process.env.NODE_ENV === 'production') {
            console.error('❌ Database reset is not allowed in production environment');
            process.exit(1);
        }
        
        await dbInitializer.reset();
        console.log('✅ Database reset completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Database reset failed:', error.message);
        process.exit(1);
    } finally {
        await dbInitializer.close();
    }
}

// Run the reset
resetDatabase();