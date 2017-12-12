'use strict';
const models = require('../models');
const sequelize = models.sequelize;
const Admin = models.Admin;
const Choice = models.Choice;
const passport = require('passport');

module.exports = {
    signUp(req, res, next){
        passport.authenticate('admin-sign-up', function(err, user, info) {
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
                        err: 'Could not sign up admin'
                    });
                }
                res.status(200).json({
                    status: ' successful sign up!'
                });
            });
        })(req, res, next);
    },

    signIn(req, res, next){
        passport.authenticate('admin-sign-in', function(err, user, info) {
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
                        err: 'Could not log in admin'
                    });
                }
                res.status(200).json({
                    status: 'Login successful!'
                });
            });
        })(req, res, next);
    },

    addChoice(req, res) {
        sequelize.transaction(t => {
            return Admin.findById(
                req.user.id,
                {transaction: t})
                .then(Admin => {
                    return Admin.createChoice({
                        name: req.body.name,
                        mechanism: req.body.mechanism,
                        result: req.body.result
                    }, {transaction: t})
                })
        })
            .then(result => {res.status(201).json({"message":"Choice created successfully", "result":result})})
            .catch(err => {
                console.log(err);
                res.status(500).send(err);
            })
    },

    addChoices(req, res){
        sequelize.transaction(t => {
            return Admin.findById(
                req.user.id,
                {transaction: t})
                .then(Admin => {
                    return Choice.bulkCreate(
                        req.body.choices.map(
                            choice => {
                                return {
                                    name: choice.name,
                                    mechanism: choice.mechanism,
                                    result: choice.result,
                                    AdminId: req.user.id
                                }
                            }
                        ),
                        {transaction: t}
                    );
                })

        })
            .then(result => {
                res.status(201).json(result);
            })
            .catch(err => {
                console.log(err);
                res.status(500).send(err);
            })
    },

    test(req,res) {
        res.status(200).send(req.user);
    },

    editChoice(req, res) {
        sequelize.transaction( t=> {
            return Choice.update(
                {
                    name: req.body.name,
                    mechanism: req.body.mechanism,
                    result: req.body.result
                },

                {
                    where: {id: req.params.idChoice, AdminId: req.params.id}
                },
                {transaction: t})
        })
            .then(result => {res.status(201).json({"message":"Success", "result":result})})
            .catch(err => {res.status(500).json(err)})
    },

    getChoices(req, res) {
        sequelize.transaction( t=> {
            return Admin.findById(
                req.params.id,
                {transaction: t})
                .then(Admin => {
                    return Admin.getChoices();
                })
        })
            .then(result => {res.status(200).json({"message":"This are your Choices", "result":result})})
            .catch(err => {res.status(500).json(err)})
    },

    deleteChoice(req, res){
        sequelize.transaction( t=> {
            return Choice.destroy(
                {
                    where: {id: req.params.idChoice, AdminId: req.params.id}
                },

                {transaction: t}
            )
        })
            .then(result => {res.status(200).json({"message":"Choice Deleted", "result":result})})
            .catch(err => {res.status(500).json(err)})
    },
};