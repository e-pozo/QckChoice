var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var hbs = require('express-handlebars');

//Authentication Packages
var session = require('express-session');
var passport = require('passport');
var MySQLStore = require('express-mysql-session')(session);
var options = require('./config/dbConfig.json');
var sessionStore = new MySQLStore(options);
var db = require('./models/index');
require ('./config/passport')(passport);
var app = express();

app.io = require('socket.io')();
var index = require('./routes/index')(app.io);
//var users = require('./routes/users')(app.io);

// view engine setup
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/scripts', express.static(__dirname + '/node_modules/'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'oisfmmisjrgoxnsaoi',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    //cookie: {secure:true}
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use('/', index);
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
