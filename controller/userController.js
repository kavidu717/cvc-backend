import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'

dotenv.config()
 
 export function createUser(req,res){
       
    const hashData=req.body

    hashData.password=bcrypt.hashSync(hashData.password,10)
 //console.log(hashData);
    const newUser=new User(hashData)

    // beforre create the that part firt create the adnin
    if(hashData.type=="admin"){
         if(req.user==null){
            res.json({
                message:"please login as administrator to create the admin account"
            })
            return
         }
         if(req.user.type!="admin"){
              res.json({
                message:"please login as administrator to create the admin account"
              })
         } return
    }

    newUser.save().then(
        ()=>{
            res.json({
               message:"new user created"
           }
       ) }
      ).catch(
        ()=>{
            res.json({
                message:"user not created "
           })
        }
      )
}

 export function loginUser(req,res){
     User.find({email:req.body.email}).then(
        (users)=>{
        if(users.length==0){
            res.json({
                message:"user not found"
            })
        }else{
            const user=users[0]
            const isPasswordCorrecct=bcrypt.compareSync(req.body.password,user.password)
            if(isPasswordCorrecct){
                // create the token
              const token=jwt.sign({
                email:user.email,
                firstName:user.firstName,
                lastName:user.lastName,
                isBlock:user.isBlock,
                type:user.type,
                profilePicture:user.profilePicture

              },process.env.SECRET_KEY)
              res.json({
                 message:"user login in",
                 token:token
              })

            }else{
                res.json({
                    message:"invalid password"
                })
            }
        }
        }
     )
 }
 // to check customer or admim

 export function isAdmin(req){
     if(req.user==null){
         return false
     } if(req.user.type!="admin"){
            return false
     }
     return true
 }

 export function isCustomer(req){
     if(req.user==null){
         return false
     } if(req.user.type!="customer"){
            return false
     }
     return true
 }