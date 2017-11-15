module.exports = (sequelize, DataTypes) => {
    const Session = sequelize.define('Session',{
        title: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT
        },
        guestPass:{
            type: DataTypes.TEXT,
            allowNull: false
        },
        moderatorPass:{
            type: DataTypes.TEXT,
            allowNull: false
        }

    });

    Session.associate = (models) => {
        Session.hasMany(models.Event);
        Session.belongsToMany(models.Person, {through: models.PersonSession});
    };

    return Session;
};
