'use strict'
const Person = require('../models').Person;

module.exports = {
    create(req, res){
        return Person
            .create({
                userName: req.body.userName,
                imgURL : req.body.imgUrl,
                RegisteredId: null
            })
            .then(Person => res.status(201).send(Person))
            .catch(error => res.status(400).send(error));
    },
};
