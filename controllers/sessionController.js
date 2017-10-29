'use strict';
const models = require('../models');
const Session = models.Session;
const PersonSession = models.PersonSession;
const sequelize = models.sequelize;


module.exports = {
    create(req, res){
        sequelize.transaction(t => {
            return Session.create({
                title: req.body.title,
                description: req.body.description,
            }, {transaction: t})
                .then( Session => {
                return PersonSession.create({
                    PersonId: req.user.id,
                    SessionId: Session.id,
                    isModerator: true
                }, {transaction: t})
            })
        })
            .then(data => {res.status(201).json(data)})
            .catch(err => {res.status(500).json(err)})
        ;
        console.log(req.user);
    },

    isModeratorOfThisSession(req, res, next) {
        PersonSession.findOne({
            where: {
                SessionId: req.params.id
            }
        })
            .then(personSession => {
                if (personSession.dataValues.isModerator == true) {
                    return next();
                }
                else {
                    res.status(403).json("You aren't a moderator of this session, so you cannot modify it!.");
                }
            })
            .catch( err => {
                res.status(500).json({"err": err, "message": "An error occurred on the server."})
            })
    }
};
