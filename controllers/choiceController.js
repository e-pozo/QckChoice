'use strict';

const models = require('../models');
const sequelize = models.sequelize;
const Choice = models.Choice;

const controller = {
    getChoices: getChoices
};

function getChoices(req, res) {
    sequelize.transaction(t => {
        return Choice.findAll({transaction: t})
    })
        .then(result => {
            res.status(200).json({"message":"Here is your choices", "result": result});
        })
}

module.exports = controller;