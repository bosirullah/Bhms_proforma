const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const findOrCreate = require("mongoose-findorcreate");
const LocalStrategy = require("passport-local");
const _ = require("lodash");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const userSchema = require("../models/user");
const Patient = require("../models/patient");


require("dotenv").config();

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));

router.use(cookieParser('keyboard cat'));
// router.use(session({
//     secret: 'keyboard cat',
//     resave: true,
//     saveUninitialized: true,
//     cookie: { maxAge: 60000 }
// }))
router.use(flash());

router.use(session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false
}));

router.use(passport.initialize());
router.use(passport.session());


userSchema.plugin(passportLocalMongoose);
// userSchema.plugin(findOrCreate);

const User = new mongoose.model("User",userSchema);

passport.use(new LocalStrategy(User.authenticate()));

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
    res.render("register");
})

router.get("/login",(req,res)=>{
    const errors = req.flash().error || [];
    res.render("login",{errors: errors});
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
            res.redirect("/register");
        } 
        else {
            // passport.authenticate("local")(req, res, function(){
            //     res.redirect("/login");
            // });
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
                failureFlash: true,
                failureRedirect: "/login",
            })(req, res, function(){
                // console.log(req.user);
                const authenticatedUser = {
                    email: user.email
                };
                req.user = authenticatedUser;
                res.redirect("/home");
            });
        }
    });
    
});

module.exports = router;