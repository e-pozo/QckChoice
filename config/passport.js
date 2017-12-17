'use strict';
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var bcrypt = require('bcryptjs');
var configAuth = require('./auth');

var models = require('../models');
var Person = models.Person;
var Local = models.Local;
var Admin = models.Admin;
var Facebook = models.Facebook;
var Google = models.Google;
var LocalCreate = models.Local;
var sequelize = models.sequelize;


var count = 0;
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
                if (Local){
                    done(null, false, {message: 'That email already exist, sign up with a new email'});
                }
                else {
                    return sequelize.transaction(t => {
                        return Person.create({
                            userName: req.body.userName,
                            imgURL: req.body.imgUrl || null
                        }, {transaction: t})
                        .then(Person => {
                            return Person.createLocal({
                                email: email,
                                password: password,
                                isAdmin: false
                            },{transaction: t})
                        })
                    })
                        .then(result => done(null,result))
                        .catch(err => done(err));
                }
            })
            .catch(err => done(err));
        });
    }));

    passport.use('anonymous-personCore', new LocalStrategy(
        {
            usernameField: 'userName',
            passwordField: 'userName',
            passReqToCallback: true
        },
        (req, userName, pass, done) => {
            sequelize.transaction(t => {
                return Person.create(
                    {
                        userName: userName+count,
                    },
                    {transaction: t}
                )
            })
                .then(result => {
                    count++;
                    done(null,result);
                })
                .catch(err => {
                    done(err);
                })
        }
    ));

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

    passport.use('admin-sign-in', new LocalStrategy({
            usernameField: 'rut',
            passwordField: 'password',
            passReqToCallback: true
        },
        (req, rut, password, done) => {
            process.nextTick(() => {
                Admin.findOne({
                    where: {
                        rut: rut
                    }
                })
                    .then(Admin => {
                        if (Admin){
                            bcrypt.compare(password, Admin.password, (err, res) => {
                                if(err){
                                    throw err;
                                }
                                if(res){
                                    done(null, Admin);
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

    passport.use('admin-sign-up', new LocalStrategy({
            usernameField: 'rut',
            passwordField: 'password',
            passReqToCallback: true
        },
        (req, rut, password, done) => {
            process.nextTick(() => {
                return Admin.findOne({
                    where: {
                        rut: rut
                    }
                })
                    .then(Admin => {
                        if (Admin){
                            done(null, false, {message: 'That rut already exist, sign up with a new rut'});
                        }
                        else {
                            return sequelize.transaction(t => {
                                return Admin.create({
                                    email: req.body.email,
                                    name: req.body.name,
                                    rut: rut,
                                    password: password
                                }, {transaction: t})
                            })
                                .then(result => done(null,result))
                                .catch(err => done(err));
                        }
                    })
                    .catch(err => done(err));
            });
        }));

    passport.use(new FacebookStrategy({
            clientID: configAuth.facebookAuth.clientID,
            clientSecret: configAuth.facebookAuth.clientSecret,
            callbackURL: configAuth.facebookAuth.callbackURL,
            profileFields: ['email', 'first_name', 'last_name', 'picture']
        },
        function(accessToken, refreshToken, profile, done) {
            process.nextTick(() => {
                console.log(profile);
                Facebook.findOne({idAcc: profile.id})
                    .then(Facebook => {
                        if (Facebook){
                            done(null, Facebook);
                        }
                        else{
                            sequelize.transaction(t => {
                                return Person.create({
                                    userName: profile.username || 'Facebook user ' + count,
                                    imgURL: profile.photos[0].value
                                }, {transaction: t})
                                    .then(Person => {
                                        return Person.createFacebook({
                                            idAcc: profile.id,
                                            token: accessToken,
                                            name: profile.name.givenName + ' ' + profile.name.familyName,
                                            email: profile.emails[0].value
                                        }, {transaction: t})
                                    })
                            })
                                .then( result => done(null,result))
                                .catch(err => done(err));
                        }
                    }).catch(err => done(err));
            })
        }
    ));

    passport.use(new GoogleStrategy({
            clientID: configAuth.googleAuth.clientID,
            clientSecret: configAuth.googleAuth.clientSecret,
            callbackURL: configAuth.googleAuth.callbackURL
        },
        function(token, tokenSecret, profile, done) {
            process.nextTick(() => {
                console.log(profile);
                Google.findOne({idAcc: profile.id})
                    .then(Google => {
                        if (Google){
                            done(null, Google);
                        }
                        else{
                            sequelize.transaction(t => {
                                return Person.create({
                                    userName: profile.username || 'Google user ' + count,
                                    imgURL: profile.photos[0].value
                                }, {transaction: t})
                                    .then(Person => {
                                        return Person.createGoogle({
                                            idAcc: profile.id,
                                            token: token,
                                            name: profile.displayName,
                                            email: profile.emails[0].value
                                        }, {transaction: t})
                                    })
                            })
                                .then( result => done(null,result))
                                .catch(err => done(err));
                        }
                    }).catch(err => done(err));
            })
        }
    ));
};
