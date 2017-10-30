'use strict';
const models = require('../models');
const Session = models.Session;
const PersonSession = models.PersonSession;
const sequelize = models.sequelize;
const Event = models.Event;


module.exports = {
    create(req, res){
        sequelize.transaction(t => {
            return Session.create({
                title: req.body.title,
                description: req.body.description,
            }, {transaction: t})
                .then( Session => {
                return PersonSession.create({
                    PersonId: req.user.id,
                    SessionId: Session.id,
                    isModerator: true
                }, {transaction: t})
            })
        })
            .then(data => {res.status(201).json(data)})
            .catch(err => {res.status(500).json(err)})
    },

    makeEvent(req, res) {
        sequelize.transaction(t => {
            return Event.create({SessionId: req.params.id,
                    objective: req.body.objective},

                    {transaction: t})
        })
            .then(result => {res.status(201).json({"message":"Event created successfully", "result":result})})
            .catch(err => {res.status(500).json(err)})
    },

    listEvent(req, res) {
        sequelize.transaction( t=> {
            return Event.findAll({
                where: {
                    SessionId: req.params.id
                }
            }, {transaction: t})
        })
            .then(result => {res.status(200).json({"message":"This are your events", "result":result})})
            .catch(err => {res.status(500).json(err)})
    },

    updateEvent(req, res) {
        sequelize.transaction( t=> {
            return Event.update(
                {
                    objective: req.body.objective
                },

                {
                    where: {SessionId: req.params.id, id: req.params.idEvent}
                },

                {transaction: t}
            )
        })
            .then(result => {res.status(201).json({"message":"Success", "result":result})})
            .catch(err => {res.status(500).json(err)})
    },

    deleteEvent(req, res){
        sequelize.transaction( t=> {
            return Event.destroy(
                {
                    where: {SessionId: req.params.id, id: req.params.idEvent}
                },

                {transaction: t}
            )
        })
            .then(result => {res.status(200).json({"message":"Deleted", "result":result})})
            .catch(err => {res.status(500).json(err)})
    },

    isModeratorOfThisSession(req, res, next) {
        PersonSession.findOne({
            where: {
                SessionId: req.params.id
            }
        })
            .then(personSession => {
                if (personSession.dataValues.isModerator == true) {
                    return next();
                }
                else {
                    res.status(403).json("You aren't a moderator of this session, so you cannot modify it!.");
                }
            })
            .catch( err => {
                res.status(500).json({"err": err, "message": "An error occurred on the server."})
            })
    },

    isInThisSession(req, res, next) {
        PersonSession.findOne({
            where: {
                PersonId: req.user.id,
                SessionId: req.params.id
            }
        })
            .then(personSession => {
                if(personSession) {
                    return next();
                }
                else {
                    res.status(403).json("You aren't participating on this session.");
                }
            })
            .catch( err => {
                res.status(500).json({"err": err, "message": "An error occurred on the server."})
            })
    }
};
