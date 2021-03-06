'use strict';
const models = require('../models');
const Session = models.Session;
const PersonSession = models.PersonSession;
const Argument = models.Argument;
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
                    PersonId: req.user.PersonId || req.user.id,
                    SessionId: Session.id,
                    isModerator: true
                }, {transaction: t})
            })
        })
            .then(data => {res.status(201).json(data)})
            .catch(err => {res.status(500).json(err)})
    },

    makeEvent(req, res, next) {
        sequelize.transaction(t => {
            return Event.create({SessionId: req.params.id,
                    objective: req.body.objective},

                    {transaction: t})
        })
            .then(result => {
                res.status(201).json({"message":"Event created successfully", "result":result});
                next();
            })
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

    updateEvent(req, res, next) {
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
            .then(result => {
                res.status(201).json({"message":"Success", "result":result});
                next();
            })
            .catch(err => {res.status(500).json(err)})
    },

    deleteEvent(req, res, next){
        sequelize.transaction( t=> {
            return Event.destroy(
                {
                    where: {SessionId: req.params.id, id: req.params.idEvent}
                },

                {transaction: t}
            )
        })
            .then(result => {
                res.status(200).json({"message":"Deleted", "result":result});
                next();
            })
            .catch(err => {res.status(500).json(err)})
    },


    getParticipants(req, res){
        sequelize.transaction( t => {
            return Session.findById(req.params.id, {transaction: t})
                .then(Session => {
                    return Session.getPeople({
                        through: {PersonSession},
                        transaction: t
                    })
                })
        })
            .then(result => {
                res.status(200).json({"message":"Here are all participants of this session", "result": result});
            })
            .catch(err => {
                console.log(err);
                res.status(500).send(err);
            });
    },

    getPeopleWhoVote(req, res){
        Session.findById(req.params.id)
            .then(Session => {
                return Session.getEvents({
                    include: {model: Argument, attributes: ['personId']}
                })
            })
            .then(result => {
                result = result
                    .map(event => event.Arguments)
                    .reduce((peopleWhoVote, peopleWhoVoteInEvent) => {
                        for (let person of peopleWhoVoteInEvent){
                            if(peopleWhoVote.indexOf(person.personId)===-1){
                                peopleWhoVote.push(person.personId);
                            }
                        }
                        return peopleWhoVote;
                    },[]);
                res.status(200).json({"message": "People who vote", "result": result});
            })
            .catch(err => {
                console.log(err);
                res.status(500).send(err);
            })
    },

    isModeratorOfThisSession(req, res, next) {
        PersonSession.findOne({
            where: {
                SessionId: req.params.id,
                PersonId: req.user.PersonId || req.user.id
            }
        })
            .then(personSession => {
                if (personSession.dataValues.isModerator === true) {
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

    isActiveThisSession(req, res, next){
        Session.findById(req.params.id)
            .then(Session => {
                if(Session.dataValues.active){
                    return next();
                }
                else{
                    res.status(403).json("This Session is finished!");
                }
            })
            .catch(err => {
                   res.status(500).json({"err": err, "message": "An error occurred on the server."})
            })
    },

    isInThisSession(req, res, next) {
        PersonSession.findOne({
            where: {
                PersonId: req.user.PersonId || req.user.id,
                SessionId: req.params.id
            }
        })
            .then(personSession => {
                if(personSession) {
                    console.log("si participa en esta session");
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
