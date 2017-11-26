module.exports = (sequelize, DataTypes) => {
    const Vote = sequelize.define('Vote',{
        priority: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },{timestamps: false});

    return Vote;
};