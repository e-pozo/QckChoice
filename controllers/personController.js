'use strict';
const models = require('../models');
const Person = models.Person;
const Session = models.Session;
const PersonSession = models.PersonSession;
const sequelize = models.sequelize;
const uuidv4 = require('uuid/v4');
const passport = require('passport');

module.exports = {
    create(req, res, next){
        passport.authenticate('anonymous-personCore', function(err, user, info) {
            console.log(user);
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(401).json({
                    err: info
                });
            }
            req.logIn(user, function(err) {
                if (err) {
                    return res.status(500).json({
                        err: 'Could not sign up user'
                    });
                }
                res.status(200).json({
                    status: ' successful sign up!'
                });
            });
        })(req, res, next);
    },

    validateSession(req, res) {
        sequelize.transaction(t => {
            return Person.findById(req.user.id, {transaction: t})
                .then(Person => {
                    return Person.getSessions({through: {where: {SessionId: req.params.id}}, transaction: t})
                })
        })
            .then((result) => {
                res.status(200).json(result);
            })
            .catch(err => {
                res.status(500).json(err);
            });
    },

    createSession: function (req, res) {
        sequelize.transaction(t => {
            return Session.create({
                title: req.body.title,
                description: req.body.description,
                keyPass: uuidv4()
            }, {transaction: t})
                .then(Session => {
                    return Person.findById(req.user.id, {transaction: t})
                        .then(Person => {
                            return Person.addSession(Session, {through: {isModerator: true}, transaction: t});
                        })
                })
        })
            .then((result) => {
                res.status(201).json(result);
            })
            .catch(err => {
                res.status(500).json(err);
            });
    },
    addSession: function (req, res) {
        sequelize.transaction(t => {
            return Session.findOne(
                {
                    where: {id: req.params.id, keyPass: req.params.keyPass}
                },
                {transaction: t})
                .then(Session => {
                    return Person.findById(req.user.id, {transaction: t})
                        .then(Person => {
                            return Person.addSession(Session, {through: {isModerator: false}, transaction: t});
                        })
                })
        })
            .then(result => {
                res.status(201).json(result);
            })
            .catch(err => {
                res.status(500).json(err);
            })
    },

    updateSession: function (req, res) {
        sequelize.transaction(t => {
            return Session.update(
                {
                    title: req.body.title,
                    description: req.body.description
                },
                {
                    where: {id: req.params.id}
                },
                {
                    transaction: t
                }
            );
        })
            .then(result => {
                res.status(201).json(result);
            })
            .catch(err => {
                res.status(500).json(err);
            })
    },

    getSessions: function (req, res) {
        sequelize.transaction(t => {
            return Person.findById(req.user.id, {transaction: t})
                .then(Person => {
                    return Person.getSessions({
                        through: {
                            PersonSession
                        },
                        transaction : t
                    })
                })
        })
            .then((result) => {
                res.status(200).json(result);
            })
            .catch(err => {
                res.status(500).json(err);
            });
    },

    deleteSession: function (req, res) {
        sequelize.transaction(t => {
            return Person.findById(req.user.id, {transaction: t})
                .then(Person => {
                    return Person.removeSession(req.params.id, {transaction: t})
                        .then(Session.destroy({
                            where: {
                                id: req.params.id
                            },
                            transaction: t
                        }))
                })
        })
            .then(result => {
                res.status(200).json(result);
            })
            .catch(err => {
                res.status(500).json(err);
            })
    },

    listSessions(req,res){
        sequelize.transaction( t => {
            return Person.findById(req.user.id, {transaction: t})
                .then( Person => {
                    return Person.getSessions({transaction: t})
                })
        })
            .then(result => {
                res.status(200).json(result);
            })
            .catch(err => {
                res.status(500).json(err);
            })
    }
};
