const mongoose = require("mongoose");
// const {userConnection} = require("../utils/database");
const Patient = require("../models/patient");

let conn = mongoose.createConnection("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema ({
    email: String,
    password: String,
    googleId: String,
});

userSchema.virtual("patients",{
    ref: "patients",
    localField: "_id",
    foreignField: "doctor"
})


// const User = conn.model("User",userSchema);

module.exports = userSchema;