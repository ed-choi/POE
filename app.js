var express = require('express');
var passport = require('passport');
var util = require('util');
var session = require('express-session');
var SteamStrategy = require('./strategy');

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Steam profile is serialized
//   and deserialized.
passport.serializeUser(function(user,done){
    done(null,user);
});

passport.deserializeUser(function(obj,done){
    done(null,obj)
});

passport.use(new SteamStrategy({
    returnURL: 'http://localhost:3000/auth/steam/return',
    realm: 'http://localhost:3000/', //This is what i think we need to change this keeps track of where the id is valid
    apiKey: 'steam api key'
    },
    function(identifier, profile, done){
        process.nextTick(function(){
            //they say to associate the steam account with a record in our database but we don't have one so i keep this the same
            profile.identifier = identifier;
            return done(null,profile); //profile is user
        });
    }
));

var app = express();

app.set('views', __dirname+'/views');
app.set('view engine', 'ejs');
app.use(session({
    secret: 'your secret',
    name: 'name of session id',
    resave: true,
    saveUninitialized: true}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname+'/../../public'));

app.get('/', function(req,res){
    res.render('index', {user:req.user});//renders index with user info as arg
});

app.get('/logout', function(req,res){
    req.logout();
    res.redirect('/');
});
//not entirely sure what this part is doing
//uses passport.auth this will bring us to steam login. after it will go to /auth/steam/return
app.get('/auth/steam',
    passport.authenticate('steam', {failureRedirect: '/'}),
    function(req,res){
        res.redirect('/');
});

//set auth/steam/return
app.get('/auth/steam/return',
    passport.authenticate('steam',{failureRedirect:'/'}),
    function(req,res){
        res.redirect('/');
});

app.listen(3000);

function ensureAuthenticated(req,res,next){
    if(req.isAuthenticated()){return next();}
    res.redirect('/');
}
