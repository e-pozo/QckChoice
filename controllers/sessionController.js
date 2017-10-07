'use strict'
const models = require('../models');
const Session = models.Session;
const sequelize = models.sequelize;


module.exports = {
    create(req, res){
        console.log(models);
        res.redirect('/userSession');
    },
};
