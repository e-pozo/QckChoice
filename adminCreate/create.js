const Sequelize = require('sequelize');
let config = require('../config/dbConfig.json');
let sequelize = new Sequelize(config.database, config.user, config.password,{dialect: 'mysql'});
const admin = sequelize.import('../models/admin.js');

function registro(email, name, rut, password){
    admin.create({
        email: email,
        name: name,
        rut: rut,
        password: password
    })
}

//Para crear un admin se debe hacer por consola:
// ADMIN=*email,*name,*rut,*password node adminCreate/create.js
// Reemplazar variables con * por valores deseados.

let inputConsole = process.env.ADMIN;
inputConsole = inputConsole.split(',');
registro(inputConsole[0], inputConsole[1], inputConsole[2], inputConsole[3]);
