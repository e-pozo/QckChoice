module.exports = (sequelize, DataTypes) => {
    const Facebook = sequelize.define('Facebook',{
        idAcc: {
            type: DataTypes.TEXT,
        },
        token: {
            type: DataTypes.TEXT
        },
        email: {
            type: DataTypes.TEXT
        },
        name: {
            type: DataTypes.TEXT
        }
    },{
        timestamps: false
    });

    return Facebook;
}
