module.exports = (sequelize, DataTypes) => {
    const PersonSession = sequelize.define('PersonSession',{
        isModerator: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    },{
        timestamps:false
    });

    return PersonSession;
};