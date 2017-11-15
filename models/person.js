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
        Person.hasOne(models.Local);
        Person.hasOne(models.Twitter);
        Person.hasOne(models.Facebook);
        Person.hasOne(models.Google);
        Person.belongsToMany(models.Session, {through: models.PersonSession});
    };

    return Person;
};
