import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    quantity : {
        type : Number,
        required : true,
        default : 0
    },
    product : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Product",
        required : true
    }
})

const orderSchema = new mongoose.Schema({
    orderPrice : {
        type : Number,
        required : true,
        default : 0
    },
    orderNumber : {
        type : String,
        required : true
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    orderItems : [orderItemSchema],
    address : {
        type : String,
        required : true
    },
    orderStatus : {
        type : String,
        required : true,
        default : "Pending",
        enum : ["Pending", "Delivered", "Cancelled"]
    }
}, {timestamps : true})

export const Order = mongoose.model('Order', orderSchema)