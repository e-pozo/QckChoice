module.exports = (sequelize, DataTypes) => {
    const Registered = sequelize.define('Registered',{
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    },{
        timestamps: false
    });

    return Registered;
}
