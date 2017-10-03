'use strict'
const Person = require('../models').Person;
const Registered = require('../models').Registered;
var bcrypt = require('bcrypt');

module.exports = {
    create(req, res){
        return Registered
            .create({
                email: req.body.email,
                password : bcrypt.hashSync(req.body.password, 8)//TODO implement Asynchronic Hash
            })
            .then(Registered => Person.create({
                userName: req.body.userName,
                imgURL: req.body.imgUrl,
                RegisteredId: Registered.id
            }))
            .then(Registered => {
                req.login(Registered.id, error => {
                    res.status(201);
                    res.redirect('/');
                });
                //res.status(201).send(Registered);
                })
            .catch(error => res.status(400).send(error));
    },
    //check(req,res){}
};
