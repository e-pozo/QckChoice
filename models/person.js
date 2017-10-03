module.exports = (sequelize, DataTypes) => {
    const Person = sequelize.define('Person',{
        userName: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        imgURL: DataTypes.TEXT
    },{
        timestamps: false
    });

    Person.associate = (models) => {
        Person.belongsTo(models.Registered, {onDelete: 'CASCADE'});
        Person.belongsToMany(models.Session, {through: 'PersonSession', timestamps: false});
        Person.belongsToMany(models.EventChoice, {through: 'Vote'});
    }

    return Person;
}
