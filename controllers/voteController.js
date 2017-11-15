'use strict';
const models = require('../models');
const sequelize = models.sequelize;
const Vote = models.Vote;
const Argument = models.Argument;


module.exports = {

    addVote(req, res) {
        console.log(req.body.votes);
        const votes = (arg,vts) => {
            let listOfvotes = [];
            for (let vote of vts){
                listOfvotes.push({priority: vote.priority, ChoiceId: vote.ChoiceId, ArgumentId: arg.id})
            }
            return listOfvotes
        };
        sequelize.transaction(t => {
            return Argument.create({
                reason: req.body.reason,
                eventId: req.params.idEvent,
                personId: req.user.PersonId
            }, {transaction: t})
                .then((Argument) => {
                    return Vote.bulkCreate(votes(Argument,req.body.votes), {transaction: t})
                })
        })
            .then(result => {
                res.status(201).json(result);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json("internal server error");
            })
    }
};