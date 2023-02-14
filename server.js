const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const app = express();
const Patient = require("./models/patient");
require("dotenv").config();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Handling all get requests
app.get("/", (req, res) => {
  res.render("login");
});

app.get("/:customRouteName", (req, res) => {
  const customRouteName = _.capitalize(req.params.customRouteName);
  res.render(customRouteName);
});

app.get("/preview", (req, res) => {
  // Patient.find((err,patient)=>{
  //     if(err) console.log(err);
  //     else{
  //         res.send(patient);
  //     }
  // })
  res.render("home");
  // res.send(req.body);
});

// Handling All post Requests
app.post("/", (req, res) => {
  res.render("home");
});

app.post("/home", (req, res) => {
  const ref_no = req.body.ref_no;
  const fullName = req.body.fullName;
  const phoneNo = req.body.phoneNo;

  Patient.find((err, patients) => {
    if (err) console.log(err);
    else {
      // res.send(patients[1].pages.ref_no);
      patients.forEach((patient) => {
        // console.log(patient.pages.ref_no);
        if (
          ref_no === patient.pages.ref_no ||
          fullName === patient.pages.fullName ||
          phoneNo === patient.pages.contact
        ) {
          res.render("preview", { patientDetails: patient.pages });
        }
      });
    }
  });
});

let patient;
app.post("/form", (req, res) => {
  patient = new Patient({ pages: req.body });
  res.render("preview", { patientDetails: req.body });
});

app.post("/preview", (req, res) => {
  // if(Patient.findById(patient))
  Patient.insertMany(patient, (err) => {
    if (err) console.log(err);
    else console.log("Successfull");
  });
  res.render("home", { patientDetails: req.body });
});


app.get("*", (req, res) => {
    res.render("errorPage");
});

// Server is running
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} .....`);
});
