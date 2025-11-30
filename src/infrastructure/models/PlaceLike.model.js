import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.config.js';

const PlaceLikeModel = sequelize.define('PlaceLike', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'user_id',
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    placeId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'place_id'
    }
}, {
    tableName: 'places_likes',
    timestamps: true,
    underscored: true,
    updatedAt: false,
    indexes: [
        { fields: ['user_id'] },
        { fields: ['place_id'] },
        { unique: true, fields: ['user_id', 'place_id'] }
    ]
});

export default PlaceLikeModel;
