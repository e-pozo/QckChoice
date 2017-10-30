'use strict';
const models = require('../models');
const sequelize = models.sequelize;
const Vote = models.Vote;


module.exports = {
    addVote(req, res) {
        console.log(models)
        sequelize.transaction(t => {
            return Vote.create({
                ChoiceId: req.params.idChoice,
                EventId: req.params.idEvent
            }, {transaction: t})
        })
            .then(data => {res.status(201).json(data)})
            .catch(err => {res.status(500).json(err)})
    }
};