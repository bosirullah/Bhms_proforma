const mongoose = require("mongoose")

mongoose.set("strictQuery",false);
let connection = mongoose.createConnection("mongodb://127.0.0.1:27017/patientlistDB");

module.exports = connection;