module.exports = (sequelize, DataTypes) => {
    const Twitter = sequelize.define('Twitter',{
        idAcc: {
            type: DataTypes.TEXT,
        },
        token: {
            type: DataTypes.TEXT
        },
        displayName: {
            type: DataTypes.TEXT
        },
        userName: {
            type: DataTypes.TEXT
        }
    },{
        timestamps: false
    });

    return Twitter;
}
