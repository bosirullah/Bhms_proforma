const mongoose = require("mongoose");

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

module.exports = userSchema;