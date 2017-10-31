var express = require('express');
var router = express.Router();
var path = require('path');
var controllers = require('../controllers');
const personController = controllers.person;
const localPersonController = controllers.local;
const sessionController = controllers.session;
const eventController = controllers.event;

//Return if a person is logged or not.
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

//Log out a person
router.get('/api/logOut', (req, res) => {
    req.logout();
    console.log(req.session);
    req.session.destroy();
    console.log("Bye!");
    console.log(req.session);
    res.status(200).json({status: 'Bye!'});
});
//Create an anonymous person.
router.post('/api/createAnonymousPerson', personController.create);
//Sign up a person trough Local Strategy
router.post('/api/signUp', localPersonController.localSignUp);
//Log in a person trough Local Strategy
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

//Allow to vote
router.post('/api/session/:id/event/:idEvent/choice/:idChoice',
        authenticationMiddleware(),
        sessionController.isInThisSession,
        eventController.createVote);
//List all votes of an event
router.get('/api/session/:id/event/:idEvent',
        authenticationMiddleware(),
        sessionController.isInThisSession,
        eventController.getVotes);

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
