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
        //Event.belongsToMany(models.Choice, {through: models.Vote});
        Event.hasMany(models.Chat);
        //Event.hasMany(Event);
        Event.hasMany(models.Argument, {foreignKey: "eventId"});
    };
    return Event;
};
