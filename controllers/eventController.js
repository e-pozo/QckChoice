'use strict';
const models = require('../models');
const sequelize = models.sequelize;
const Event = models.Event;
const Choice = models.Choice;
const Vote = models.Vote;
const controller = {
    createVote: createVote,
    getVotes: getVotes
};

function createVote(req, res){
    sequelize.transaction(t => {
        return Choice.findById(req.params.idChoice, {transaction: t})
            .then(Choice => {
                console.log(Choice);
                return Event.findById(req.params.idEvent, {transaction: t})
                    .then(Event => {
                        return Event.addChoice(Choice, {through: Vote, transaction: t})
                    })
            })
    })
        .then((result) => {
            res.status(201).json({"message": "vote created for this event", "result": result});
        })
        .catch(err => {
            res.status(500).json(err);
        });
}

function getVotes(req, res) {
    sequelize.transaction(t => {
        return Event.findById(req.params.idEvent, {transaction: t})
            .then(Event => {
                return Event.getVotes({transaction: t})
            })
    })
        .then((result) => {
            res.status(200).json({"message": "Here is the votes of this event", "result": result});
        })
        .catch(err => {
            res.status(500).json(err);
        });
}

module.exports = controller;