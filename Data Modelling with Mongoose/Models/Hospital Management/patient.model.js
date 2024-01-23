import e from "express";
import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    diagnosedWith : {
        type : String,
        required : true
    },
    patientAddress : {
        type : String,
        required : true
    },
    age : {
        type : Number,
        required : true
    },
    bloodGroup : {
        type : String,
        enum : ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
        required : true
    },
    gender : {
        type : String,
        enum : ["Male", "Female", "Others"],
        required : true
    },
    admittedIn : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Hospital",
        required : true
    },
    photo : {
        type : String,
        required : true
    },
    admittedOn : {
        type : Date,
        required : true
    }
}, { timestamps: true });

export const Patient = mongoose.model('Patient', patientSchema)