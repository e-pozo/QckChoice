'use strict';
const models = require('../models');
const sequelize = models.sequelize;
const Event = models.Event;
const Choice = models.Choice;
const Vote = models.Vote;
const Chat = models.Chat;
const Person = models.Person;
const Local = models.Local;
const Twitter = models.Twitter;
const Facebook = models.Facebook;
const Google = models.Google;
const controller = {
    getThisEvent: getThisEvent,
    createVote: createVote,
    getVotes: getVotes,
    addMessageToChat: addMessageToChat,
    listMessages: listMessages
};

function getThisEvent(req, res) {
    sequelize.transaction(t => {
        return Event.findById(req.params.idEvent, {transaction: t})
    })
        .then(result => {
            res.status(200).json({"message": "Here is the Event", "result": result})
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({"err": err})
        })
}

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
                return Event.getArguments({transaction: t,
                    include: [
                        {model: Choice, attributes: {exclude: ['id', 'LocalId']}},
                        {model: Person, include: [
                            {model: Local, attributes: ['email', 'isAdmin']},
                            {model: Twitter, attributes: ['displayName', 'userName']},
                            {model: Facebook, attributes: ['email', 'name']},
                            {model: Google, attributes: ['email', 'name']}
                        ]}
                    ],
                    attributes: {exclude: ["id", "eventId", "personId"]}
                })
            })
    })
        .then((result) => {
            res.status(200).json({"message": "Here is the votes of this event", "result": result});
        })
        .catch(err => {
            console.log(err);
            res.status(500).json("internal server error");
        });
}

function listMessages(req, res) {
    sequelize.transaction(t => {
        return Event.findById(req.params.idEvent, {transaction: t})
            .then(Event => {
                return Event.getChats({
                    transaction: t,
                    include: Person,
                    attributes: {exclude: "PersonId"},
                    order: ['createdAt']
                })
            })
    })
        .then(result => {
            res.status(200).json({"message":"Here is your messages of this event","result": result});
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({"message":"An internal server error happened", "error": err});
        })
}

function addMessageToChat(req, res) {
    sequelize.transaction(t => {
        return Event.findById(req.params.idEvent, {transaction: t})
            .then(Event => {
                return Event.createChat({message: req.body.message, PersonId: req.user.personId || req.user.id}, {transaction: t})
            })
    })
        .then(result => {
            res.status(201).json({"message":"Message stored", "result":result});
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({"message":"An internal server error happened","error":err});
        })
}

module.exports = controller;