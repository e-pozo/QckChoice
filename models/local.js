 var bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
    const Local = sequelize.define('Local',{
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        isAdmin: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    },{
        hooks: {
            afterValidate: (local) => {
                local.password = bcrypt.hashSync(local.password, 8);
            }
        },
        timestamps: false
    });

    Local.associate = (models) => {
        Local.hasMany(models.Choice);
    };

    return Local;
};
