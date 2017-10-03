module.exports = (sequelize, DataTypes) => {
    const EventChoice = sequelize.define('EventChoice', {}, {timestamps: false});
    return EventChoice;
};
