var express = require('express');
var router = express.Router();
var passport = require('passport');
var controllers = require('../controllers');
const personController = controllers.person;
const localPersonController = controllers.local;
const sessionController = controllers.session;

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(req.user);
    console.log(req.isAuthenticated());
    res.render('index', { title: 'Express' });
});
router.get('/lobby', (req, res, next) =>{
    res.render('lobby');
});

router.get('/signUp',(req, res , next) => {
    res.render('signUp');
});

router.get('/logIn', (req, res, next) => {
    res.render('logIn')
});

router.get('/sessionUser', authenticationMiddleware(), (req, res, next) => {
    res.render('sessionUser');
});

router.get('/logOut', (req, res, next) => {
    req.logout();
    req.session.destroy();
    res.redirect('/logIn');
});

router.post('/person', personController.create);
router.post('/signUp', passport.authenticate('local-signup',{
    successRedirect: '/sessionUser',
    failureRedirect: '/signUp',
    failureFlash: true
}));

router.post('/signIn', passport.authenticate('local-sigin',{
    successRedirect: '/sessionUser',
    failureRedirect: '/logIn',
    failureFlash: true
}));

router.post('/sessionCreate', authenticationMiddleware(), sessionController.create);

function authenticationMiddleware() {
    return (req, res, next) => {
        console.log(`
            req.session.passport.user: ${JSON.stringify(req.session.passport)}`);
        if(req.isAuthenticated()) return next();

        res.redirect('/login');
    }
}
module.exports = router;
