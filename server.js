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
  // console.log(`getrequest: ${req.body}`)
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

let patient;
app.post("/preview", (req, res) => {
  patient = new Patient({ pages: req.body });
  res.render("preview", { patientDetails: req.body, patient_id: patient._id });
});

let patientData;

app.post("/preview/:id", (req, res) => {
  const patientId = req.params.id;
  console.log(patientId);
  // console.log(req.body);
  patientData = req.body;
  res.render("preview", { patientDetails: req.body, patient_id: patientId });
});
app.post("/preview2", (req, res) => {
  const ref_no = req.body.ref_no;
  const fullName = req.body.fullName;
  const phoneNo = req.body.phoneNo;

  Patient.findOne({ "pages.ref_no": ref_no }, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      if (data === null) {
        console.log("Not Found");
      } else {
        res.render("preview", {
          patientDetails: data.pages,
          patient_id: data._id,
        });
      }
    }
  });
});

app.post("/form", (req, res) => {
  // patient = new Patient({ pages: req.body });
  console.log(req.body);
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
  // patient = new Patient({ pages: req.body })
  // console.log(req.params.id);
  // console.log(patientData);
  Patient.countDocuments({ _id: req.params.id }, (err, count) => {
    if (count > 0) {
      Patient.findByIdAndUpdate(
        req.params.id,
        { pages: patientData },
        (err, patient) => {
          if (err) console.log(err);
          else {
            console.log("Successfully updated");
            res.render("home", {
              patientDetails: patientData,
              patient_id: req.params.id,
            });
          }
        }
      );
    } else {
      console.log("else e jacche");
      patient
        .save()
        .then(() => console.log("successfull"))
        .catch((err) => {
          console.log(err);
        });
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} .....`);
});
