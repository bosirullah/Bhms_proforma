const mongoose = require("mongoose");
const connection = require("../utils/database");

const patientSchema = new mongoose.Schema({
    pages: []
});

const Patient = connection.model("Patient",patientSchema);

module.exports = Patient;