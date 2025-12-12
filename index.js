import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';


import productRouter from './routes/productRouter.js';
import userRouter from './routes/userRouter.js';
import jwt , { decode } from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config()




const app = express();

// mongo bd connection string
const mongodbUrl=process.env.MONGO_DB_URL

// to create the mongodb connection
mongoose.connect(mongodbUrl,{})
const connection = mongoose.connection

connection.once("open",
    ()=>{
        console.log("database connected");
    }
)

// use the body parser middleware
 app.use(bodyParser.json())
  app.use(
    (req,res,next)=>{
    const token=req.header("Authorization")?.replace("Bearer ", "")
      //  next();
      if(token!=null){
        jwt.verify(token,process.env.SECRET_KEY,
            (error,decoded)=>{
                if(!error){
                    console.log(decoded)
                    req.user=decoded
                }
            }
        
    )
      }
      next()
    }
 )
 

 app.use("/api/user",userRouter)
 app.use("/api/product",productRouter)

app.listen(
    5000,
     () => {
    console.log("server is running on port 5000");

});
  
//"email": "admin@example.com",        // as admin
//  "password": "superSecurePassword!123",


// "email": "admin3@example.com",     as customer
// "password": "superSecurePassword!123",