import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
//import Student from './models/student.js';
import studentRouter from './routes/studentRouter.js';
import productRouter from './routes/productRouter.js';
import userRouter from './routes/userRouter.js';
import jwt , { decode } from 'jsonwebtoken'






const app = express();

// mongo bd connection string
const mongodbUrl="mongodb+srv://admin:1234@cluster0.ugpprvh.mongodb.net/?appName=Cluster0";

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
        jwt.verify(token,"kavidu123",
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
 

 app.use("/api/student",studentRouter)
 app.use("/api/product",productRouter)
 app.use("/api/user",userRouter)


app.listen(
    5000,
     () => {
    console.log("server is running on port 5000");

});
