import UserModel from './User.model.js';
import RefreshTokenModel from './RefreshToken.model.js';
import PlaceLikeModel from './PlaceLike.model.js';

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

UserModel.hasMany(PlaceLikeModel, {
    foreignKey: 'userId',
    as: 'placeLikes',
    onDelete: 'CASCADE'
});

PlaceLikeModel.belongsTo(UserModel, {
    foreignKey: 'userId',
    as: 'user'
});

export {
    UserModel,
    RefreshTokenModel,
    PlaceLikeModel
};
