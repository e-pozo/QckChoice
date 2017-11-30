var bcrypt = require('bcrypt');
module.exports = (sequelize, DataTypes) => {
    const Admin = sequelize.define('Admin',{
        email: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        rut: {
            type: DataTypes.STRING(10),
            allowNull: false
        },
        password: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    },
    {
        hooks: {
            afterValidate: (admin) => {
                admin.password = bcrypt.hashSync(admin.password, 8);
            }
        },
        timestamps: false
    });

    Admin.associate = (models) => {
        Admin.hasMany(models.Choice);
    };

    return Admin;
};
