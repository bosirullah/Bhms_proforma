const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const router = express.Router();
const Patient = require("../models/patient");
const {parse} = require("json2csv");
const fs = require("fs");


router.use(bodyParser.urlencoded({ extended: true }));
//set cookeParser,session and flash
router.use(cookieParser('keyboard cat'));
router.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))
router.use(flash());

let patient;
let patientData;

router.get("/contact",(req,res)=>{
    res.send(req.flash("message"));
})

router.get("/errorPage",(req,res)=>{
    res.render("errorPage")
})

router.get("/form",(req,res)=>{
    console.log(`form = ${req.isAuthenticated()}`)
    if(req.isAuthenticated()){
        res.render("form",{patientDetails: req.body,patient_id:req.body.id});
    }
    else res.render("main",{patientDetails: req.body,patient_id:req.body.id});
})

router.get("/preview2",(req,res)=>{
    console.log(`preview2 = ${req.isAuthenticated()}`)
    if(req.isAuthenticated()){
        res.render("preview",{patientDetails: req.body,patient_id:req.body.id});
    }
    else res.render("main",{patientDetails: req.body,patient_id:req.body.id});
})

router.get("/preview",(req,res)=>{
    console.log(`preview = ${req.isAuthenticated()}`)
    if(req.isAuthenticated()){
        res.render("preview",{patientDetails: req.body,patient_id:req.body.id});
    }
    else res.render("main",{patientDetails: req.body,patient_id:req.body.id});
})

router.get("/home",(req,res)=>{
    console.log(`home = ${req.isAuthenticated()}`)
    if(req.isAuthenticated()){
        res.render("home",{patientDetails: req.body,patient_id:req.body.id});
    }
    else res.render("main",{patientDetails: req.body,patient_id:req.body.id});
})

// router.use(function(req, res, next) {
//     res.status(404);
//     // respond with html page
//     if (req.accepts('html')) {
//         res.render("errorPage", { url: req.url });
//         return;
//     }
// });

// router.get("/:customRouteName",(req,res)=>{
//     // const customRouteName = _.capitalize(req.params.customRouteName);
//     // res.render(customRouteName,{patientDetails: req.body,patient_id:req.body.id});
//     res.render("errorPage");
// })

router.get("/form/:id",(req,res)=>{
    Patient.findById(req.params.id,(err,patient)=>{
        if(err) console.log(err);
        else{
            res.render("form",{patientDetails:patient});
        }
    })
})

router.get("/*",(req,res)=>{
    res.render("errorPage");
})

router.post("/preview",(req,res)=>{
    console.log(req.user);
    patient = new Patient({ pages: req.body, doctor: req.user.username });
    res.render("preview",{patientDetails: req.body,patient_id: patient._id});
})

router.post("/preview/:id", (req, res)=>{
    const patientId = req.params.id;
    patientData = req.body;
    res.render("preview",{patientDetails: req.body, patient_id:patientId});
})

router.post("/preview2",(req,res)=>{
    const ref_no = req.body.ref_no;
    const fullName = req.body.fullName;
    const phoneNo = req.body.phoneNo;

    Patient.findOne({'pages.ref_no': ref_no, 'doctor': req.user.username}, (err, data)=>{
        if(err){
            console.log(err);
        }
        else{
            if(data === null){
                console.log("Not Found");
            }
            else{
                res.render("preview",{patientDetails: data.pages, patient_id: data._id});
            }
        }
    })
    
})

router.post("/form",(req,res)=>{              
    console.log(req.body);
    res.render("preview",{patientDetails: req.body,patient_id: req.body.id}); 
})

router.post("/form/:id",(req,res)=>{
    Patient.findById(req.params.id,(err,patient)=>{
        if(err) console.log(err);
        else{
            res.render("form",{patientDetails: patient.pages,patient_id: req.params.id});
        }   
    })
})

router.post("/home/:id",(req,res)=>{
    Patient.countDocuments({_id: req.params.id},(err,count)=>{
        console.log(`${req.user.username} created this patient`);
        if(count > 0){
            Patient.findByIdAndUpdate(req.params.id, {'pages': patientData, 'doctor': req.user.email}, (err,patient)=>{
                if(err) console.log(err);
                else {
                    console.log("Successfully updated");
                    res.render("home",{patientDetails: patientData, patient_id:req.params.id});
                }
            })
        }
        else{
            console.log("else e jacche")
            patient.save().then(()=>console.log("successfull")).catch((err)=>{
                console.log(err);
            });
            res.render("home",{patientDetails: patientData, patient_id:req.params.id});
        }
    })
})

router.post("/export",(req,res)=>{
    Post.findOne
})



module.exports = router;