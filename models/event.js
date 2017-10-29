module.exports = (sequelize, DataTypes) => {
    const Event = sequelize.define('Event', {
        timeTaken: {
            type: DataTypes.TIME,
            allowNull: true
        },
        objective: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    });

    Event.associate = (models) => {
        Event.belongsToMany(models.Choice, {through: 'Vote'});
        Event.Chats = Event.hasMany(models.Chat);
    };
    return Event;
};
