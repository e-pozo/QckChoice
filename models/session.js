module.exports = (sequelize, DataTypes) => {
    const Session = sequelize.define('Session',{
        title: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT
        },
        keyPass:{
            type: DataTypes.TEXT
        }
    });

    Session.associate = (models) => {
        Session.hasMany(models.Event);
        Session.belongsToMany(models.Person, {through: models.PersonSession});
    };
    return Session;
};
