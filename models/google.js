module.exports = (sequelize, DataTypes) => {
    const Google = sequelize.define('Google',{
        idAcc: {
            type: DataTypes.TEXT
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

    return Google;
}
