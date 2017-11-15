'use strict';
const models = require('../models');
const Person = models.Person;
const Session = models.Session;
const Local = models.Local;
const Twitter = models.Twitter;
const Facebook = models.Facebook;
const Google = models.Google;
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

    getMyData(req, res) {
        sequelize.transaction(t => {
            return Person.findById(req.user.PersonId, {
                attributes: ['userName', 'imgUrl'],
                include:[{model:Local, attributes: ['email']},
                        {model: Twitter, attributes: ['userName', 'displayName']},
                        {model:Facebook, attributes: ['email', 'name']},
                        {model: Google, attributes: ['email', 'name']}],
                transaction: t})
        })
            .then(result => {
                res.status(200).json(result);
            })
            .catch(err => {
                res.status(500).json(err);
            })
    },

    validateSession(req, res) {
        Person.findById(req.user.PersonId)
            .then(Person => {
                Person.getSessions({through:{ isModerator: true}})
                    .then(Session => {
                        if(Session){
                            res.status(200).json(Session)
                        }
                        else{
                            Person.getSession({through:{ isModerator: false}, attributes:{exclude: 'moderatorPass'}})
                                .then(Session => {
                                    res.status(200).json(Session)
                                })
                        }
                    })
            })
    },

    createSession: function (req, res) {
        sequelize.transaction(t => {
            return Session.create({
                title: req.body.title,
                description: req.body.description,
                guestPass: uuidv4(),
                moderatorPass: uuidv4()
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
                        attributes: {
                            exclude:['moderatorPass']
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
