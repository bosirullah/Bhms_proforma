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

router.get("/form", async (req, res) => {
    try {
        // Fetch the default ref_no for the current user
        const defaultRefNo = await Patient.findOne(
            { doctor: req.user.username },
            { ref_no: 1 },
            { sort: { ref_no: -1 } }
        );

        // If no patients exist yet for this user, set a default value of 1
        const refNoValue = defaultRefNo ? defaultRefNo.ref_no + 1 : 1;

        if (req.isAuthenticated()) {
            res.render("form", { patientDetails: req.body, patient_id: req.body.id, ref_no: refNoValue });
        } else {
            res.render("main", { patientDetails: req.body, patient_id: req.body.id, ref_no: refNoValue });
        }
    } catch (error) {
        console.error(error);
        req.flash("error", "Failed to fetch the default ref_no.");
        res.redirect("/home");
    }
});

router.get("/preview2",(req,res)=>{
    if(req.isAuthenticated()){
        res.render("preview",{patientDetails: req.body,patient_id:req.body.id});
    }
    else res.render("main",{patientDetails: req.body,patient_id:req.body.id});
})

router.get("/preview", async (req, res) => {
    try {
        // Fetch the default ref_no for the current user
        const defaultRefNo = await Patient.findOne(
            { doctor: req.user.username },
            { ref_no: 1 },
            { sort: { ref_no: -1 } }
        );

        // If no patients exist yet, set a default value of 1
        const refNoValue = defaultRefNo ? defaultRefNo.ref_no + 1 : 1;

        if (req.isAuthenticated()) {
            res.render("preview", { patientDetails: req.body, patient_id: req.body.id, ref_no: refNoValue });
        } else {
            res.render("main", { patientDetails: req.body, patient_id: req.body.id, ref_no: refNoValue });
        }
    } catch (error) {
        console.error(error);
        req.flash("error", "Failed to fetch the default ref_no.");
        res.redirect("/home");
    }
});


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

router.get("/form/:id", (req, res) => {
    const patientId = req.params.id;

    // Find the patient by ID
    Patient.findById(patientId, (err, patient) => {
        if (err) {
            console.error(err);
            req.flash("error", "Failed to fetch patient data.");
            return res.redirect("/home");
        }

        if (!patient) {
            console.log("Not Found");
            req.flash("error", "Patient not found!");
            return res.redirect("/home");
        }

        ref_no = patient.ref_no;
        // Render the form page with patient data
        res.render("form", { patientDetails: patient.pages, patient_id: patientId,ref_no });
    });
});


router.get("/printForm/:id",(req,res)=>{
    Patient.findById(req.params.id,(err,patient)=>{
        if(err) console.log(err);
        else{
            res.render("printForm",{patientDetails:patient,patient_id:req.params.id});
        }
    })
})

router.get("/preview/:id", async (req, res) => {
    try {
        // Retrieve the patient ID from the URL parameter
        const patientId = req.params.id;

        // Look up the patient by ID and retrieve their data, including ref_no
        Patient.findById(patientId, (err, patient) => {
            if (err) {
                console.error(err);
                req.flash("error", "Failed to fetch patient data.");
                return res.redirect("/home");
            }

            if (!patient) {
                req.flash("error", "Patient not found.");
                return res.redirect("/home");
            }

            // Fetch the ref_no from the patient's data
            const refNoValue = patient.ref_no;

            // Render the preview page with patient data and ref_no
            res.render("preview", { patientDetails: patient.pages, patient_id: patientId, ref_no: refNoValue });
        });
    } catch (error) {
        console.error(error);
        req.flash("error", "Failed to fetch the ref_no.");
        res.redirect("/home");
    }
});

router.get("/*",(req,res)=>{
    res.render("errorPage");
})

router.post("/preview", async (req, res) => {
    try {
        // Fetch the default ref_no for the current user
        const defaultRefNo = await Patient.findOne(
            { doctor: req.user.username },
            { ref_no: 1 },
            { sort: { ref_no: -1 } }
        );

        // If no patients exist yet, set a default value of 1
        const refNoValue = defaultRefNo ? defaultRefNo.ref_no + 1 : 1;

        // Create a new patient record with the incremented ref_no
        const patient = new Patient({ pages: req.body, doctor: req.user.username, ref_no: refNoValue });

        // Save the patient record
        await patient.save();

        // Pass ref_no to the preview template
        res.render("preview", { patientDetails: req.body, patient_id: undefined, ref_no: refNoValue });
    } catch (error) {
        console.error(error);
        req.flash("error", "Failed to create a new patient.");
        res.redirect("/home");
    }
});

router.post("/preview/:id", async (req, res) => {
    try {
        // Fetch the default ref_no for the current user
        const defaultRefNo = await Patient.findOne(
            { doctor: req.user.username },
            { ref_no: 1 },
            { sort: { ref_no: -1 } }
        );

        // If no patients exist yet, set a default value of 1
        const refNoValue = defaultRefNo ? defaultRefNo.ref_no : 1;

        const patientId = req.params.id;
        patientData = req.body;

        // Pass ref_no to the preview template along with patient_id
        res.render("preview", { patientDetails: req.body, patient_id: patientId, ref_no: refNoValue });
    } catch (error) {
        console.error(error);
        req.flash("error", "Failed to fetch the default ref_no.");
        res.redirect("/home");
    }
});

router.post("/preview2", async (req, res) => {
    try {
        const ref_no = req.body.ref_no;
        const fullName = req.body.fullName;
        const phoneNo = req.body.phoneNo;

        // Find a patient with the entered ref_no, full name, or phone number
        Patient.findOne({ $or: [{ ref_no: ref_no }, { 'pages.fullName': fullName }, { 'pages.contact': phoneNo }],doctor: req.user.username},(err, data) => {
            if (err) {
                console.error(err);
                req.flash("error", "Failed to find patient.");
                return res.redirect("/home");
            }

            if (!data) {
                console.log("Not Found");
                req.flash("error", "No Patient Found!");
                return res.redirect("/home");
            }

            // Render the preview page with patient data and ref_no
            res.render("preview", { patientDetails: data.pages, patient_id: data._id, ref_no: data.ref_no });
        }
        );
    } catch (error) {
        console.error(error);
        req.flash("error", "An error occurred.");
        res.redirect("/home");
    }
});

router.post("/form",(req,res)=>{              
    res.render("preview",{patientDetails: req.body,patient_id: req.body.id}); 
})

router.post("/form/:id", (req, res) => {
    const patientId = req.params.id;

    // Find the patient by ID and retrieve their ref_no
    Patient.findById(patientId, (err, patient) => {
        if (err) {
            console.error(err);
            req.flash("error", "Failed to fetch patient data.");
            return res.redirect("/home");
        }

        if (!patient) {
            console.log("Not Found");
            req.flash("error", "Patient not found!");
            return res.redirect("/home");
        }

        // Extract the ref_no from the patient's data
        const refNoValue = patient.ref_no;

        // Render the form page with patient data and ref_no
        res.render("form", { patientDetails: patient.pages, patient_id: patientId, ref_no: refNoValue });
    });
});


router.post("/home",(req,res)=>{
    const username = req.user.username;

    req.flash("success","Form submited successfully!");
    res.render("home",{
        successMessage: req.flash("success"),
        errorMessage: req.flash("error"),
        successUpdatedMessage: req.flash("successUpdated"),
        patientDetails: patientData,
        patient_id: req.params.id,
        username
    });
})

router.post("/home/:id",(req,res)=>{
    Patient.findByIdAndUpdate(req.params.id, {'pages': patientData, 'doctor': req.user.username}, (err,patient)=>{
        if(err) console.log(err);
        else {
            const ref_no = patient.ref_no;
            const username = req.user.username;

            console.log("Successfully updated");
            req.flash("successUpdated","Form updated successfully!")
            req.flash("error");
            res.render("home",{
                successUpdatedMessage: req.flash("successUpdated"),
                errorMessage: req.flash("error"),
                successMessage: req.flash("success"),
                patientDetails: patientData,
                patient_id: req.params.id,
                ref_no,
                username
            });
        }
    })
})

module.exports = router;