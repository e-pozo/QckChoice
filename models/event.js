module.exports = (sequelize, DataTypes) => {
    const Event = sequelize.define('Event', {
        timeTaked: {
            type: DataTypes.TIME,
            allowNull: false
        },
        objective: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    });

    Event.associate = (models) => {
        Event.belongsToMany(models.Choice, {through: 'EventChoice', timestamps: false});
        Event.belongsToMany(models.EventChoice, {through: 'Vote'});
    };
    return Event;
};
