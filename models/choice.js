module.exports = (sequelize, DataTypes) => {
    const Choice = sequelize.define('Choice', {
        name: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        mechanism: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        result: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    },{
            timestamps: false
    });

    Choice.associate = (models) => {
        Choice.belongsToMany(models.Argument, {through: models.Vote});
    }
    return Choice;
};
