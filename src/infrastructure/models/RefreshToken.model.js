import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.config.js';

const RefreshTokenModel = sequelize.define('RefreshToken', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id',
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    token: {
        type: DataTypes.STRING(500),
        allowNull: false,
        unique: true
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'expires_at'
    }
}, {
    tableName: 'refresh_tokens',
    timestamps: true,
    underscored: true,
    updatedAt: false,
    indexes: [
        {
            fields: ['user_id']
        },
        {
            unique: true,
            fields: ['token']
        },
        {
            fields: ['expires_at']
        }
    ]
});

export default RefreshTokenModel;