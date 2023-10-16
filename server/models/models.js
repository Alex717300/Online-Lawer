const sequelize = require('../db');
const {DataTypes} = require('sequelize');

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    email: {type: DataTypes.STRING, unique: true,},
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: "USER"},
    isActivated: {type: DataTypes.BOOLEAN, defaultValue: false},
    activationLink: {type: DataTypes.STRING},

});

const Token = sequelize.define('token', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    refreshToken: {type: DataTypes.STRING},
});

const ChangePasswordLink = sequelize.define('changePasswordLink', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    passwordResetLink: {type: DataTypes.STRING},
});

const UserComment = sequelize.define('usercomment', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    description: {type: DataTypes.STRING},
    userName: {type: DataTypes.STRING, allowNull: false},
    isModeration: {type: DataTypes.BOOLEAN, defaultValue: false},
})

User.hasOne(Token);
Token.belongsTo(User);

User.hasOne(ChangePasswordLink);
ChangePasswordLink.belongsTo(User);

User.hasMany(UserComment);
UserComment.belongsTo(User);

module.exports = {
    User,
    Token,
    ChangePasswordLink,
    UserComment
};