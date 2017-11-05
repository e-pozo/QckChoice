var express = require('express');
var router = express.Router();
var path = require('path');
var controllers = require('../controllers');
const personController = controllers.person;
const localPersonController = controllers.local;
const sessionController = controllers.session;
const eventController = controllers.event;
const voteController = controllers.vote;
const choiceController = controllers.choice;

//This is temporal, soon will be removed to sockets.

router
    .post('/api/session/:id/event/:idEvent/Msg',
        authenticationMiddleware(),
        sessionController.isInThisSession,
        eventController.addMessageToChat)
    .get('/api/session/:id/event/:idEvent/Msg',
        authenticationMiddleware(),
        sessionController.isInThisSession,
        eventController.listMessages);

//Return if a personCore is logged or not.
router.get('/api/logStatus', (req, res) => {
    if(!req.isAuthenticated()) {
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

//Create an anonymous personCore.
router.post('/api/createAnonymousPerson', personController.create);
//Sign up a personCore trough Local Strategy
router.post('/api/signUp', localPersonController.localSignUp);
//Log in a personCore trough Local Strategy
router.post('/api/logIn', localPersonController.localSignIn);


router
    //Create a new session to the logged personCore.
    .post('/api/sessionUser', authenticationMiddleware(), personController.createSession)
    //Read all sessions which a personCore create.
    .get('/api/sessionUser', authenticationMiddleware(), personController.getSessions)
    //Update a particular session.
    .put('/api/sessionUser/:id',
        authenticationMiddleware(),
        sessionController.isModeratorOfThisSession,
        personController.updateSession)
    //Delete a particular session.
    .delete('/api/sessionUser/:id',
        authenticationMiddleware(),
        sessionController.isModeratorOfThisSession,
        personController.deleteSession);

router
    //Join at particular session.
    .post('/api/session/:id/join/:keyPass',
        authenticationMiddleware(), 
        personController.addSession);

router
    //Create a new event for a particular session
    .post('/api/sessionUser/:id', 
        authenticationMiddleware(), 
        sessionController.isModeratorOfThisSession,
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
        sessionController.updateEvent)

    //Delete a particular event from a particular session
    .delete('/api/sessionUser/:id/event/:idEvent',
        authenticationMiddleware(), 
        sessionController.isModeratorOfThisSession,
        sessionController.deleteEvent);

//List the participating sessions.
router.get('/api/sessionParticipating',
        authenticationMiddleware(),
        personController.listSessions);

//Gets a particular session with the id.
router.get('/api/thisSession/:id',
        authenticationMiddleware(),
        sessionController.isInThisSession,
        personController.validateSession);

//Allow to vote
router.post('/api/session/:id/event/:idEvent/choice/:idChoice',
        authenticationMiddleware(),
        sessionController.isInThisSession,
        voteController.addVote);
//List all votes of an event
router.get('/api/session/:id/event/:idEvent',
        authenticationMiddleware(),
        sessionController.isInThisSession,
        eventController.getVotes);

//List all Choices
router.get('/api/choices', choiceController.getChoices);

//Pass all remains GET request to Angular router.
router.get('*', (req,res) => {
    res.sendFile(path.join(__dirname,'../public/index.html'));
});

function authenticationMiddleware() {
    return (req, res, next) => {
        console.log(`
            req.session.passport.user: ${JSON.stringify(req.session.passport)}`);
        if(req.isAuthenticated()) return next();

        res.status(401).send("Unauthorized Access!.")
    }
}

module.exports = router;
