var express = require('express');
var router = express.Router();
var passport = require('passport');

const personController = require('../controllers').person;
const registeredController = require('../controllers').registered;
/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(req.user);
    console.log(req.isAuthenticated());
    res.render('index', { title: 'Express' });
});
router.get('/lobby', (req, res, next) =>{
    res.render('lobby');
});

router.post('/person', personController.create);
router.post('/signUp', registeredController.create);

passport.serializeUser((user_id, done) => done(null,user_id));
passport.deserializeUser((user_id, done) => done(null,user_id));

function authenticationMiddleware() {
    return (req, res, next) => {
        console.log(`
            req.session.passport.user: ${JSON.stringify(req.session.passport)}`);
        if(req.isAuthenticated()) return next();

        res.redirect('/login');
    }
}
module.exports = router;
