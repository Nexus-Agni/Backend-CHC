// require('dotenv').config({ path: './.env'})
import dotenv from "dotenv";
import connectDB from "./db/index_DB.js";
dotenv.config({
     path: './.env'
})


connectDB()
.then(()=>{
    app.listen (process.env.PORT ||3000 , ()=>{
        console.log(`Server is listening at : http://localhost/${process.env.PORT}`);
    })
})
.catch((error)=>{
    console.log("Database connection error : ", error);
})