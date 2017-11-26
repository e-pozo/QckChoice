'use strict';
const models = require('../models');
const sequelize = models.sequelize;
const Vote = models.Vote;
const Argument = models.Argument;
const peopleWhoVotes = [];

function inArray(array, el) {
    for ( var i = array.length; i--; ) {
        if ( array[i] === el ) return true;
    }
    return false;
}

function isEqArrays(arr1, arr2) {
    if ( arr1.length !== arr2.length ) {
        return false;
    }
    for ( var i = arr1.length; i--; ) {
        if ( !inArray( arr2, arr1[i] ) ) {
            return false;
        }
    }
    return true;
}

function findPeopleInSession(id){
    for(var obj of peopleWhoVotes){
        if(obj.id == id){
            return obj.personIds;
        }
    }
    return [];
}

function addOne (id, personId){
    let found = false;
    for (let i=0; i<peopleWhoVotes.length; i++){
        if(peopleWhoVotes[i].id === id){
            found = true;
            if(!inArray(peopleWhoVotes[i].personIds,personId)){
                peopleWhoVotes[i].personIds.push(personId);
            }
            break;
        }
    }
    if (!found){
        peopleWhoVotes.push({id: id, personIds: [personId]})
    }
}

function lessOne (id){
    for (let i=0; i<peopleWhoVotes.length; i++){
        if(peopleWhoVotes[i].id === id){
            peopleWhoVotes.splice(i,1);
        }
    }
}


module.exports = {

    addVote(req, res) {
        console.log(req.body.votes);
        const votes = (arg,vts) => {
            let listOfvotes = [];
            for (let vote of vts){
                listOfvotes.push({priority: vote.priority, ChoiceId: vote.ChoiceId, ArgumentId: arg.id})
            }
            return listOfvotes
        };
        sequelize.transaction(t => {
            return Argument.create({
                reason: req.body.reason,
                eventId: req.params.idEvent,
                personId: req.user.PersonId || req.user.id
            }, {transaction: t})
                .then((Argument) => {
                    return Vote.bulkCreate(votes(Argument,req.body.votes), {transaction: t});
                })
        })
            .then(result => {
                res.status(201).json(result);
                addOne(req.params.id, req.user.personId || req.user.id);

            })
            .catch(err => {
                console.log(err);
                res.status(500).json("internal server error");
            })
    },

    everyOneVote(peopleWhoWantsToVote, io){
        return function (req, res, next) {

            function updatePeopleWhoWantsToVote(id){
                let peopleWhoVoteInThisSession = findPeopleInSession(id);
                for(let i = 0; i < peopleWhoWantsToVote.length; i++){
                    for(let personWhoAlreadyVote of peopleWhoVoteInThisSession){
                        if(peopleWhoWantsToVote[i] == personWhoAlreadyVote){
                            peopleWhoWantsToVote.splice(i, 1);
                        }
                    }
                }
            }


            let pass = false;
            io.on('pass', (id)=>{
                if (id === req.user.personId || req.user.id){
                    pass =true;
                }
            });

            let interval = setInterval(() => {
                if(pass){
                    clearInterval(interval);
                    res.status(409).json({message: "these people have not yet voted", personsIds: peopleWhoWantsToVote})
                }
                if(peopleWhoWantsToVote.length === 0){
                    if(index){
                        peopleWhoVotes.splice(index,1);
                    }
                    clearInterval(interval);
                    lessOne(req.params.id);
                    next();
                }
                else{
                    updatePeopleWhoWantsToVote(req.params.id);
                }
            },1000);
        }
    }
};