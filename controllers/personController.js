'use strict'
const models = require('../models');
const Person = models.Person;

module.exports = {
    create(req, res){
        return Person
            .create({
                userName: req.body.userName,
                imgURL : req.body.imgUrl
            })
            .then(Person => res.status(201).send(Person))
            .catch(error => res.status(400).send(error));
    },
};
