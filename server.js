const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();
// const connection = require("../utils/database")
const Patient = require("./models/patient");
require("dotenv").config();

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// const password = process.env.PASSWORD;
// mongoose.set("strictQuery",false);
// mongoose.connect("mongodb://127.0.0.1:27017/patientlistDB");

// const pageSchema = {
//     page: Object
// }

const patientsSchema = {
    pages: []
}

// const Page = connection.model("Page",pageSchema);
// const Patient = connection.model("Patient",patientsSchema);

const pageList = [];

app.get("/",(req,res)=>{
    res.render("page1");
})

app.get("/:customRouteName",(req,res)=>{
    const customRouteName = _.capitalize(req.params.customRouteName);
    res.render(customRouteName);
})



app.post("/page1",(req,res)=>{
    // const page1 = new Page({page: req.body});
    pageList.push(req.body);
    res.render("page2");
})

app.post("/page2",(req,res)=>{
    // const page2 = new Page({page: req.body});
    pageList.push(req.body);
    res.render("page3");
})

app.post("/page3",(req,res)=>{
    // const page3 = new Page({page: req.body});
    pageList.push(req.body);
    res.render("page4");
})

app.post("/page4",(req,res)=>{
    // const page4 = new Page({page: req.body});
    pageList.push(req.body);
    res.render("page5");
})

app.post("/page5",(req,res)=>{
    // const page5 = new Page({page: req.body});
    pageList.push(req.body);
    const patient = new Patient({ pages: pageList })
    Patient.insertMany(patient,(err)=>{
        if(err) console.log(err);
        else console.log("Successfull");
    })
    
    Patient.find((err,patients)=>{
        if(err)console.log(err);
        else{
            const jsonDATA = JSON.stringify(patients);
            res.render("display",{patientDetails: jsonDATA});
        }
        pageList.length = 0;
    })
})



const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT} .....`);
})