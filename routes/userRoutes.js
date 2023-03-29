const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require('express-session');
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

router.use(session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false
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
