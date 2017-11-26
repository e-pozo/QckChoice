module.exports = function(io) {

    var express = require('express');
    var router = express.Router();
    var path = require('path');
    var sockets = require('../sockets/index.js')(io);
    var controllers = require('../controllers');
    const personController = controllers.person;
    const localPersonController = controllers.local;
    const sessionController = controllers.session;
    const eventController = controllers.event;
    const voteController = controllers.vote;
    const choiceController = controllers.choice;

// Chat interactions.
    router
        .post('/api/session/:id/event/:idEvent/Msg',
            authenticationMiddleware(),
            sessionController.isInThisSession,
            sessionController.isActiveThisSession,
            eventController.addMessageToChat)
        .get('/api/session/:id/event/:idEvent/Msg',
            authenticationMiddleware(),
            sessionController.isInThisSession,
            eventController.listMessages);

//Data of the logged user.

    router.get('/api/aboutMe', authenticationMiddleware(), personController.getMyData);

//Return if a personCore is logged or not.
    router.get('/api/logStatus', (req, res) => {
        if (!req.isAuthenticated()) {
            return res.status(200).json({
                status: false
            });
        }
        res.status(200).json({
            status: true
        });
    });

//Log out a personCore
    router.get('/api/logOut', (req, res) => {
        req.logout();
        console.log(req.session);
        req.session.destroy();
        console.log("Bye!");
        console.log(req.session);
        res.status(200).json({status: 'Bye!'});
    });

    router
    //Get info of this local personCore.
        .get('/api/localPerson',
            authenticationMiddleware(),
            localPersonController.getPerson);
    //Update info of local personCore.

//Create an anonymous person.
    router.post('/api/createAnonymousPerson', personController.create);
//Sign up a local person trough Local Strategy
    router.post('/api/signUp', localPersonController.localSignUp);
//Log in a local person trough Local Strategy
    router.post('/api/logIn', localPersonController.localSignIn);


    router
    //Create a new session to the logged person.
        .post('/api/sessionUser', authenticationMiddleware(), personController.createSession)
        //Read all sessions which a person create.
        .get('/api/sessionUser', authenticationMiddleware(), personController.getSessions)
        //Update a particular session.
        .put('/api/sessionUser/:id',
            authenticationMiddleware(),
            sessionController.isModeratorOfThisSession,
            sessionController.isActiveThisSession,
            personController.updateSession)
        //Delete a particular session.
        .delete('/api/sessionUser/:id',
            authenticationMiddleware(),
            sessionController.isModeratorOfThisSession,
            sessionController.isActiveThisSession,
            personController.deleteSession);

    router
    //Join at particular session.
        .post('/api/session/:id/join/:keyPass',
            authenticationMiddleware(),
            sessionController.isActiveThisSession,
            personController.addSession);

    router
    //Create a new event for a particular session
        .post('/api/sessionUser/:id',
            authenticationMiddleware(),
            sessionController.isModeratorOfThisSession,
            sessionController.isActiveThisSession,
            sessionController.makeEvent)

        //Show all events form a particular session
        .get('/api/session/:id',
            authenticationMiddleware(),
            sessionController.isInThisSession,
            sessionController.listEvent)

        //Modify a particular event from a particular session
        .put('/api/sessionUser/:id/event/:idEvent',
            authenticationMiddleware(),
            sessionController.isModeratorOfThisSession,
            sessionController.isActiveThisSession,
            sessionController.updateEvent)

        //Delete a particular event from a particular session
        .delete('/api/sessionUser/:id/event/:idEvent',
            authenticationMiddleware(),
            sessionController.isModeratorOfThisSession,
            sessionController.isActiveThisSession,
            sessionController.deleteEvent);

//List the participating sessions.
    router.get('/api/sessionParticipating',
        authenticationMiddleware(),
        personController.listSessions);

//Get a particular session with the id.
    router.get('/api/thisSession/:id',
        authenticationMiddleware(),
        sessionController.isInThisSession,
        personController.getThisSession);

//Get a particular event with the idEvent.
    router.get('/api/session/:id/thisEvent/:idEvent',
        authenticationMiddleware(),
        sessionController.isInThisSession,
        eventController.getThisEvent);

//Allow to vote
    router.post('/api/session/:id/event/:idEvent/vote',
        authenticationMiddleware(),
        sessionController.isInThisSession,
        sessionController.isActiveThisSession,
        voteController.addVote);
//List all arguments & votes of an event
    router.get('/api/session/:id/event/:idEvent/vote',
        authenticationMiddleware(),
        sessionController.isInThisSession,
        eventController.getVotes);

//List all Choices
    router.get('/api/choices', choiceController.getChoices);


//Finish polling
    router.post('/api/session/:id/finish',
        authenticationMiddleware(),
        sessionController.isModeratorOfThisSession,
        sessionController.isActiveThisSession,
        voteController.everyOneVote(sockets.getSessionsConnections(), io),
        personController.finishSession,
        (req) => {
        io.emit('finish:'+req.params.id, 'sessionFinished');
    });

//Set Timers
    router.post('/api/session/:id/setTime',
        authenticationMiddleware(),
        sessionController.isModeratorOfThisSession,
        (req, res) => {
            io.emit('setTimer:'+req.params.id, req.body.time);
            res.status(200).send("time updated!");
        }
    );

//Send time at Timer
    router.post('/api/session/:id/sendTime',
        authenticationMiddleware(),
        sessionController.isInThisSession,
        (req, res) => {
            io.emit('setTimer:'+req.params.id, req.body.time);
            res.status(200).send("time updated!");
        }
    );

//Pause&PlayTimer
    router.post('/api/session/:id/toggleTime',
        authenticationMiddleware(),
        sessionController.isModeratorOfThisSession,
        (req, res) => {
            io.emit('toggleTimer:'+req.params.id, req.body.time);
            res.status(200).send("time toggled!");
        }
    );

    router.get('/api/sessionsConnections', (req,res) => {

        res.status(200).send(sockets.getSessionsConnections());
    });

//Pass all remains GET request to Angular router.
    router.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    });

    function authenticationMiddleware() {
        return (req, res, next) => {
            console.log(`
            req.session.passport.user: ${JSON.stringify(req.session.passport)}`);
            if (req.isAuthenticated()) return next();

            res.status(401).send("Unauthorized Access!.")
        }
    }

    return router;
}


