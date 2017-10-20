'use strict'
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');

var models = require('../models');
var Person = models.Person;
var Local = models.Local;
var LocalCreate = models.Local;
var sequelize = models.sequelize;

module.exports = (passport) => {

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((obj, done) => {
        done(null,obj);
    });

    passport.use('local-sign-up', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    (req, email, password, done) => {
        process.nextTick(() => {
             return Local.findOne({
                where: {
                    email: email
                }
            })
            .then(Local => {
                console.log(Local);
                if (Local){
                    done(null, false, {message: 'That email already exist, sign up with a new email'});
                }
                else {
                    return sequelize.transaction(t => {
                        return Person.create({
                            userName: req.body.userName,
                            imgURL: null
                        }, {transaction: t})
                        .then(Person => {
                            return LocalCreate.create({
                                email: email,
                                password: password,
                                PersonId: Person.id
                            },{transaction: t})
                        })
                        .then(LocalCreate => done(null,LocalCreate))
                        .catch(err => {throw err;});
                    });
                }
            })
            .catch(err => done(err));
        });
    }));

    passport.use('local-sign-in', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        (req, email, password, done) => {
            process.nextTick(() => {
                Local.findOne({
                    where: {
                        email: email
                    }
                })
                .then(Local => {
                    if (Local){
                        bcrypt.compare(password, Local.password, (err, res) => {
                            if(err){
                                throw err;
                            }
                            if(res){
                                done(null, Local);
                            }
                            else{
                                done(null, false, {message:'Wrong password'});
                            }
                        });
                    }
                    else{
                        done(null, false, {message: 'User doesn\'t exist'});
                    }
                })
                .catch(err => done(err));
            });
        })
    );
}
