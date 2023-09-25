const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
    ref_no: {
        type: Number,
        default: 0, // Default value is 1
    },
    pages: Object,
    doctor:{
        type: String,
        require: true,
        ref: "User" //Creating a relationship with user model
    }
});

// Define a pre-save middleware to auto-increment ref_no for each user
patientSchema.pre("save", async function (next) {
    if (!this.isNew) {
        return next();
    }

    try {
        // Find the maximum ref_no for the current user
        const maxRefNoPatient = await this.constructor.findOne(
            { doctor: this.doctor },
            { ref_no: 1 },
            { sort: { ref_no: -1 } }
        );

        if (maxRefNoPatient) {
            this.ref_no = maxRefNoPatient.ref_no + 1;
        } else {
            // If no previous forms for this user, start from 1
            this.ref_no = 1;
        }
    } catch (error) {
        return next(error);
    }

    next();
});


const Patient = new mongoose.model("Patient",patientSchema);

module.exports = Patient;

