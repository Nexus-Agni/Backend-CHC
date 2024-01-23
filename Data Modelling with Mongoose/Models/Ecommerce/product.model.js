import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    description : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true,
        default : 0,
        inrPrice : {
            type : Number,
            required : true,
            default : 0
        },
        usdPrice : {
            type : Number,
            required : true,
            default : 0
        }
    },
    image : {
        type : String,
        required : true
    },
    category : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Category",
        required : true
    },
    countInStock : {
        type : Number,
        required : true,
        default : 0
    },
    name : {
        type : String,
        required : true
    },
    rating : {
        type : Number,
        required : true,
        default : 0
    }
}, {timestamps : true})

export const Product = mongoose.model("Product", productSchema)