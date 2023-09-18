const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const router = express.Router();
const Patient = require("../models/patient");

router.use(bodyParser.urlencoded({ extended: true }));
//set cookeParser,session and flash
router.use(cookieParser('keyboard cat'));
router.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
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
    if(req.isAuthenticated()){
        res.render("form",{patientDetails: req.body,patient_id:req.body.id});
    }
    else res.render("main",{patientDetails: req.body,patient_id:req.body.id});
})

router.get("/preview2",(req,res)=>{
    if(req.isAuthenticated()){
        res.render("preview",{patientDetails: req.body,patient_id:req.body.id});
    }
    else res.render("main",{patientDetails: req.body,patient_id:req.body.id});
})

router.get("/preview",(req,res)=>{
    if(req.isAuthenticated()){
        res.render("preview",{patientDetails: req.body,patient_id:req.body.id});
    }
    else res.render("main",{patientDetails: req.body,patient_id:req.body.id});
})

router.get("/home", async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            // Fetch all patient data from MongoDB Atlas
            const patientDetails = await Patient.find();
            const username = req.user.username;
            
            res.render("home", {
                errorMessage: req.flash("error"),
                successMessage: req.flash("success"),
                successUpdatedMessage: req.flash("successUpdated"),
                patientDetails: patientDetails, // Pass the fetched data
                patient_id: req.body.id, // Assuming you need this for some reason
                username
            });
        } catch (error) {
            console.error(error);
            req.flash("error", "Failed to fetch patient data from the database.");
            res.redirect("/home"); // Redirect or handle the error appropriately
        }
    } else {
        res.render("main", {
            patientDetails: req.body,
            patient_id: req.body.id,
        });
    }
});

router.get("/form/:id",(req,res)=>{
    Patient.findById(req.params.id,(err,patient)=>{
        if(err) console.log(err);
        else{
            res.render("form",{patientDetails:patient,patient_id:req.params.id});
        }
    })
})

router.get("/printForm/:id",(req,res)=>{
    Patient.findById(req.params.id,(err,patient)=>{
        if(err) console.log(err);
        else{
            res.render("printForm",{patientDetails:patient,patient_id:req.params.id});
        }
    })
})

router.get("/preview/:id",(req,res)=>{
    // Retrieve the patient ID from the URL parameter
    const patientId = req.params.id;
    // console.log(patientId)

    // Look up the patient by ID and render the form with the patient's data
    Patient.findById(patientId, (err, patient) => {
        if (err) {
            console.error(err);
            req.flash("error", "Failed to fetch patient data.");
            return res.redirect("/home");
        }
        console.log("patient = ",patient)
        // Render the form with patient data
        res.render("preview", { patientDetails:patient.pages,patient_id:patientId });
    });
})

router.get("/*",(req,res)=>{
    res.render("errorPage");
})

router.post("/preview",(req,res)=>{
    patient = new Patient({ pages: req.body, doctor: req.user.username });
    res.render("preview",{patientDetails: req.body,patient_id: undefined});
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

    Patient.findOne({ $or: [{'pages.ref_no': ref_no}, {'pages.fullName': fullName}, {'pages.contact': phoneNo}] , 'doctor': req.user.username}, (err, data)=>{
        if(err){
            console.log(err);
        }
        else{
            if(data === null){
                console.log("Not Found");
                req.flash("error","No Patient Found!");
                res.redirect("/home");
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

router.post("/home",(req,res)=>{
    patient.save().then(()=>console.log("successfully saved")).catch((err)=>{
        console.log(err);
    });
    req.flash("success","Form submited successfully!");
    res.render("home",{
        successMessage: req.flash("success"),
        errorMessage: req.flash("error"),
        successUpdatedMessage: req.flash("successUpdated"),
        patientDetails: patientData,
        patient_id: req.params.id
    });
})

router.post("/home/:id",(req,res)=>{
    Patient.findByIdAndUpdate(req.params.id, {'pages': patientData, 'doctor': req.user.username}, (err,patient)=>{
        if(err) console.log(err);
        else {
            console.log("Successfully updated");
            req.flash("successUpdated","Form updated successfully!")
            req.flash("error");
            res.render("home",{
                successUpdatedMessage: req.flash("successUpdated"),
                errorMessage: req.flash("error"),
                successMessage: req.flash("success"),
                patientDetails: patientData,
                patient_id: req.params.id
            });
        }
    })
})

module.exports = router;