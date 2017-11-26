module.exports = (sequelize, DataTypes) => {
    const Chat = sequelize.define('Chat', {
        message:{
            type: DataTypes.TEXT,
            allowNull: false
        }
    });

    Chat.associate = (models) => {
       Chat.belongsTo(models.Person);
    };

    return Chat;
};