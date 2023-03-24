const mongoose = require("mongoose");
// const {connection} = require("../utils/database");

const patientSchema = new mongoose.Schema({
    pages: Object,
    doctor:{
        type: String,
        require: true,
        ref: "User" //Creating a relationship with user model
    }
});

const Patient = new mongoose.model("Patient",patientSchema);

module.exports = Patient;

