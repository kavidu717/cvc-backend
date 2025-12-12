import Product from "../models/product.js";
import { isAdmin } from "./userController.js";


   export function createProduct(req,res){
    
      if(!isAdmin(req)){
         res.json({
            message:"login as admin to add the product"
         })
         return
      }

    const newProductDate=req.body
    const product =new product(newProductDate)

    product.save().then(
        ()=>{
           res.json({
            message:"product created"
           }) 
        }
    ).catch(
        (error)=>{
         res.json({
            
            message:error
         })
        }
    )     
   }
   // every one should be able to shoe the product
   export function getProduct(req,res){
       product.find({}).then(
        (productList)=>{
          res.json(
            productList
          )
        
       })
   }


