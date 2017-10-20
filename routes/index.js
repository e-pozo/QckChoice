var express = require('express');
var router = express.Router();
var path = require('path');
var passport = require('passport');
var controllers = require('../controllers');
const personController = controllers.person;
const localPersonController = controllers.local;
const sessionController = controllers.session;

/* GET home page. */
/*router.get('/', function(req, res, next) {
    console.log(req.user);
    console.log(req.isAuthenticated());
    res.render('index', { title: 'Express' });
});*/
router.get('/api/lobby', (req, res, next) =>{
    res.render('lobby');
});

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

router.get('/api/signUp',(req, res , next) => {
    res.render('signUp');
});

router.get('/api/logIn', (req, res, next) => {
    res.render('logIn')
});

router.get('/api/sessionUser', authenticationMiddleware(), (req, res, next) => {
    res.render('sessionUser');
});

router.get('/api/logOut', (req, res) => {
    req.logout();
    console.log(req.session);
    req.session.destroy();
    console.log("Bye!");
    console.log(req.session);
    res.status(200).json({status: 'Bye!'});
});

router.post('/api/person', personController.create);
router.post('/api/signUp', function(req, res, next) {
    passport.authenticate('local-sign-up', function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({
                err: info
            });
        }
        req.logIn(user, function(err) {
            if (err) {
                return res.status(500).json({
                    err: 'Could not sign up user'
                });
            }
            res.status(200).json({
                status: ' successful sign up!'
            });
        });
    })(req, res, next);
});

router.post('/api/logIn', function(req, res, next) {
    passport.authenticate('local-sign-in', function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({
                err: info
            });
        }
        req.logIn(user, function(err) {
            if (err) {
                return res.status(500).json({
                    err: 'Could not log in user'
                });
            }
            res.status(200).json({
                status: 'Login successful!'
            });
        });
    })(req, res, next);
});


router.post('/api/sessionCreate', authenticationMiddleware(), sessionController.create);

router.get('*', (req,res) => {
    res.sendFile(path.join(__dirname,'../public/index.html'));
});

function authenticationMiddleware() {
    return (req, res, next) => {
        console.log(`
            req.session.passport.user: ${JSON.stringify(req.session.passport)}`);
        if(req.isAuthenticated()) return next();

        res.redirect('/logIn');
    }
}
module.exports = router;
