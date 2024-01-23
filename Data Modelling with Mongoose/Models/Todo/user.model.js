import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        lowercase : true,
        unique : true
    }, 
    email : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        required : true,
        min : [8, "Must be atleast 8 charecters"]
    }
}, {
    timestamps : true
})


export const User = mongoose.model("User", userSchema);

