import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.config.js';

const UserModel = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    firstName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'first_name'
    },
    lastName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'last_name'
    },
    role: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'user'
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active'
    },
    profilePhotoUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: 'profile_photo_url'
    },
    gender: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 0,
            max: 130
        }
    },
    favoritePlaces: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: [],
        field: 'favorite_places'
    }
}, {
    tableName: 'users',
    timestamps: true,
    underscored: true,
    indexes: [
        {
            unique: true,
            fields: ['email']
        },
        {
            fields: ['is_active']
        }
    ]
});

export default UserModel;
