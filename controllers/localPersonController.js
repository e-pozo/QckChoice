'use strict'
const models = require('../models');
const Person = models.Person;
const Local = models.Local;
const sequelize = models.sequelize;


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
    /*check(req,res){
        return Local.
            findOne({
                where:{
                    email: req.body.email
                }
            }).then(Local => {
                if(Local){
                    console.log(Local);
                    bcrypt.compare(req.password, Local.password, (err, response) => {
                        if(err){
                            res.redirect('/logIn');
                        }
                        if(response){
                            req.login(Register.id, error => {
                                res.render('sessionUser');
                            });
                        }
                        else {
                            res.redirect('/logIn');
                        }
                    });
                }
                else{
                    console.log("User No Exits");
                    res.redirect('/logIn');
                }
                console.log(Local);
            })
            .catch(error => res.status(400).send(error));
    },*/
};
