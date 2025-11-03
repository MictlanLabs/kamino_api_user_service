import { Sequelize } from 'sequelize';
import databaseConfig from './database.config.js';

// Create Sequelize instance with database configuration
const sequelize = new Sequelize(
    databaseConfig.database,
    databaseConfig.user,
    databaseConfig.password,
    {
        host: databaseConfig.host,
        port: databaseConfig.port,
        dialect: 'postgres',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        define: {
            timestamps: true,
            underscored: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
);

export default sequelize;