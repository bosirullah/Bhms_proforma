// requiring all modules
const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const app = express();
const Patient = require("./models/patient");
require("dotenv").config();

// set view engine
app.set("view engine", "ejs");

// body parser  
app.use(bodyParser.urlencoded({ extended: true }));
  
// use all static files 
app.use(express.static("public"));


/////////////// Handling all get requests ////////////////
app.get("/", (req, res) => {
  res.render("login");
});

app.get("/:customRouteName", (req, res) => {
  const customRouteName = _.capitalize(req.params.customRouteName);
  // console.log(req.bod)
  res.render(customRouteName, {
    patientDetails: req.body,
    patient_id: req.body.id,
  });
});

app.get("/form/:id", (req, res) => {
  // console.log(req.params.id)
  Patient.findById(req.params.id, (err, patient) => {
    if (err) console.log(err);
    else {
      res.render("form", { patientDetails: patient });
    }
  });
});

// app.get("/preview",(req,res)=>{
//     // Patient.find((err,patient)=>{
//     //     if(err) console.log(err);
//     //     else{
//     //         res.send(patient);
//     //     }
//     // })
//     res.render("home");
//     // res.send(req.body);
// })

// app.get("/preview/:id",(req,res)=>{
//     res.render("preview",{patientDetails: req.body,patient_id: req.params.id});
// })

// app.get("/*", (req, res) => {
//     res.render("errorPage");
// })

//

////////////////// Handling all Post requests //////////////////

app.post("/home", (req, res) => {
  // const ref_no = req.body.ref_no;
  // const fullName = req.body.fullName;
  // const phoneNo = req.body.phoneNo;
  // Patient.find((err, patients) => {
  //   if (err) console.log(err);
  //   else {
  //     // res.send(patients[1].pages.ref_no);
  //     patients.forEach((patient) => {
  //       // console.log(patient.pages.ref_no);
  //       if (
  //         ref_no === patient.pages.ref_no ||
  //         fullName === patient.pages.fullName ||
  //         phoneNo === patient.pages.contact
  //       ) {
  //         res.render("preview", { patientDetails: patient.pages });
  //       }
  //     });
  //   }
  // });
});

let patient;
app.post("/preview", (req, res) => {
  patient = new Patient({ pages: req.body });

  const ref_no = req.body.ref_no;
  const fullName = req.body.fullName;
  const phoneNo = req.body.phoneNo;
  // console.log(req.body.id);

  // res.render("preview",{patientDetails: req.body,patient_id: req.body.id});

  Patient.find((err, patients) => {
    if (err) console.log(err);
    else {
      // res.send(patients[1].pages.ref_no);
      // if(patients){
      patients.forEach((patient) => {
        // console.log(patient.pages.ref_no);
        if (
          ref_no === patient.pages.ref_no ||
          fullName === patient.pages.fullName ||
          phoneNo === patient.pages.contact
        ) {
          res.render("preview", {
            patientDetails: patient.pages,
            patient_id: patient.id,
          });
        }
      });
      // }
    }
  });
});

app.post("/preview/:id", (req, res) => {
  // console.log(req.body);
  Patient.findByIdAndUpdate(req.params.id, req.body, (err, patient) => {
    if (err) console.log(err);
    else {
      console.log("Successfully updated");
      res.render("preview", {
        patientDetails: req.body,
        patient_id: req.params.id,
      });
    }
  });

  // res.render("preview",{patientDetails: req.body,patient_id:req.params.id});
});

app.post("/form", (req, res) => {
  // patient = new Patient({ pages: req.body })
  res.render("preview", { patientDetails: req.body, patient_id: req.body.id });
});

app.post("/form/:id", (req, res) => {
  // console.log(req.body);
  Patient.findById(req.params.id, (err, patient) => {
    if (err) console.log(err);
    else {
      // console.log(patient);
      res.render("form", {
        patientDetails: patient.pages,
        patient_id: req.params.id,
      });
    }
  });
});

app.post("/home/:id", (req, res) => {
  // if(Patient.findById(patient))
  // if(patient !== undefined){
  //     Patient.findByIdAndUpdate(req.params.id,req.body,(err,patient)=>{
  //         if(err) console.log(err);
  //         else {
  //             console.log("Successfully updated");
  //             res.render("preview",{patientDetails: req.body,patient_id:req.params.id});
  //         }
  //     })
  // }
  // else{
  //     Patient.insertMany(patient,(err)=>{
  //         if(err) console.log(err);
  //         else{
  //             console.log("Successfull");
  //         }
  //     })
  // }
  res.render("home", { patientDetails: req.body, patient_id: req.params.id });
  // patient.save().then(()=>console.log("successfull"));
});



// Our server is running
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} .....`);
});
