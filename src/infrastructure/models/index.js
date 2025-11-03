import UserModel from './User.model.js';
import RefreshTokenModel from './RefreshToken.model.js';

// Define associations
UserModel.hasMany(RefreshTokenModel, {
    foreignKey: 'userId',
    as: 'refreshTokens',
    onDelete: 'CASCADE'
});

RefreshTokenModel.belongsTo(UserModel, {
    foreignKey: 'userId',
    as: 'user'
});

export {
    UserModel,
    RefreshTokenModel
};