const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require('express-session');
// const session = require('cookie-session');
const MongoStore = require('connect-mongo'); //to store sessions in mongodb so that the memory dosent get leaked
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const LocalStrategy = require("passport-local").Strategy;
const _ = require("lodash");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const userSchema = require("../models/user");
const Patient = require("../models/patient");


require("dotenv").config();

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));

router.use(cookieParser('keyboard cat'));

router.use(flash());
/* 
    The MongoStore is used for session management in Express applications, specifically for storing session data in MongoDB. 
    Here's the purpose and significance of using MongoStore:

    Persistent Session Storage: By default, Express sessions are stored in memory, which means session data is lost when the server restarts or crashes. 
    To ensure that session data is persistent and can survive server restarts, you can use MongoStore to store session data in a MongoDB database. 
    This allows users to remain authenticated and maintain their session state even if the server is restarted.

    Scalability: When you store session data in memory, it's limited to a single server instance.If your application needs to scale horizontally, 
    with multiple server instances, storing sessions in memory becomes problematic because each server maintains its own session data. 
    MongoStore resolves this issue by providing a centralized storage solution in MongoDB that can be accessed by multiple server instances.

    Security: Storing session data in memory is not ideal for sensitive information. With MongoStore, session data is stored in a database,
    making it more secure because MongoDB provides built-in security features. This is especially important if your session data
    contains sensitive user information or authentication tokens.

    Long-term Data Retention: MongoDB is a NoSQL database designed for storing and retrieving large amounts of data. Using MongoStore allows
    you to keep session data for an extended period, which can be useful for auditing or analyzing user behavior over time.

    Easy Integration: MongoStore is designed to work seamlessly with Express and other related packages like express-session. 
    It provides an easy-to-use interface for storing and retrieving session data in MongoDB.
*/
//memory unleaked
// router.set('trust proxy',1);
const password = process.env.PASSWORD;

router.use(session({
    secret: "Our little secret.",
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 3600000, // Adjust the session timeout as needed (in milliseconds)
    },
    store: MongoStore.create({ 
        mongoUrl: "mongodb+srv://atlas-admin:" + password + "@bhmsproformacluster.hozzyuc.mongodb.net/patientlistDB", 
        mongooseConnection: mongoose.connection,
    }),
}));

router.use(passport.initialize());
router.use(passport.session());


userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User",userSchema);

passport.use(new LocalStrategy({ usernameField: 'email' },(email, password, done) => {
    User.findOne({ email: email }, (err, user) => {
        if (err) { return done(err); }
        if (!user) {
            return done(null, false, { message: 'Invalid email or password' });
        }
        if (!user.validPassword(password)) {
            return done(null, false, { message: 'Invalid email or password' });
        }
        return done(null, user);
    });
    }
));

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

router.get("/",(req,res)=>{
    res.render("main");
})


router.get("/register",(req,res)=>{
    res.render("register",{
        errorMessage: req.flash("error")
    });
})

router.get("/login",(req,res)=>{
    res.render("login",{
        successMessage: req.flash('success'),
        errorMessage: req.flash('error')
    })
})

router.get("/logout", function(req, res){
    req.logout(function(err){
        if(err) {
            return err;
        }
        res.redirect("/");
    });
});

router.post("/register", function(req, res){
    User.register({username: req.body.username}, req.body.password, function(err, user){
        if (err) {
            console.log(err);
            req.flash('error', 'Registration failed. Please try again.');
            res.redirect("/register");
        } 
        else {
            req.flash('success', 'Successfully registered!');
            res.redirect("/login");
        }
    });
});

router.post("/login", function(req, res){

    const user = new User({
        email: req.body.username,
        password: req.body.password
    });

    req.login(user, function(err){
        if (err) console.log(err); 
        else {
            passport.authenticate("local",{
                successRedirect: '/home',
                failureRedirect: '/login',
                failureFlash: true
            })(req, res, function(){
                req.flash('error');
                const authenticatedUser = {
                    email: user.email
                };
                req.user = authenticatedUser;
            });
        }
    });
    
});

module.exports = router;
