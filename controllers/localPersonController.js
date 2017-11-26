'use strict';
const models = require('../models');
const Person = models.Person;
const Local = models.Local;
const sequelize = models.sequelize;
const passport = require('passport');

module.exports = {
    create(req, res){
        return sequelize.transaction( t => {
            return Person.create({
                userName: req.body.userName,
                imgURL: req.body.imgUrl
            },{transaction: t})
            .then(Person => {
                return Local.create({
                    email: req.body.email,
                    password: req.body.password,
                    PersonId: Person.id
                },{transaction: t})
            })
            .then(result => res.status(201).send(result))
            .catch(err => {
                console.log(err);
                res.status(400).send(err);
            });
        })
    },

    getPerson(req, res){
        sequelize.transaction(t => {
            return Local.findById(req.user.id, {transaction: t})
                .then(Local => {
                    return Local.getPerson({transaction: t})
                })
        })
            .then(result => {
                res.status(200).json({"message": "This is your info", "result": result});
            })
            .catch(err =>{
                res.status(500).json(err);
            })
    },

    localSignIn(req, res, next){
        passport.authenticate('local-sign-in', function(err, user, info) {
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
                        err: 'Could not log in user'
                    });
                }
                res.status(200).json({
                    status: 'Login successful!'
                });
            });
        })(req, res, next);
    },
    localSignUp(req, res, next){
        passport.authenticate('local-sign-up', function(err, user, info) {
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
    }
};
