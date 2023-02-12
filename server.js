const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const app = express();
const Patient = require("./models/patient");
require("dotenv").config();

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/",(req,res)=>{
    res.render("login");
});

app.get("/:customRouteName",(req,res)=>{
    const customRouteName = _.capitalize(req.params.customRouteName);
    res.render(customRouteName);
});

app.get("/*", (req, res) => {
    res.render("errorPage");
})

app.get("/preview",(req,res)=>{
    Patient.find((err,patient)=>{
        if(err) console.log(err);
        else{
            res.send(patient);
        }
    })

    // res.send(req.body);
})

app.get("/home",(req,res)=>{
    res.render("home");
})



app.post("/",(req,res)=>{
    res.render("home");
})

app.post("/home",(req,res)=>{
    const patient = new Patient({ pages: req.body })
    Patient.insertMany(patient,(err)=>{
        if(err) console.log(err);
        else console.log("Successfull");
    })
    // res.send(req.body);
    res.render("preview",{patientDetails: req.body}); 
})

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT} .....`);
});