module.exports = (sequelize, DataTypes) => {
    const models = sequelize.models;
    const Argument = sequelize.define('Argument',{
        reason: {
            type: DataTypes.TEXT
        },
        personId: {
            type: DataTypes.INTEGER,
            references:{
                model: models.Person,
                key: 'id'
            },
            allowNull: false
        },
        eventId: {
            type: DataTypes.INTEGER,
            references:{
                model: models.Event,
                key: 'id'
            },
            allowNull: false
        }
    }, {
        indexes: [{
            unique: true,
            fields: ['personId','eventId']
        }]
    });

    Argument.associate = (models) => {
        Argument.belongsToMany(models.Choice,{through: models.Vote});
        Argument.belongsTo(models.Person, {foreignKey: 'personId'});
    };
    //const qInterface = sequelize.queryInterface.QueryGenerator;
    //console.log(qInterface);

    return Argument;
};