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
    const product =new Product(newProductDate)

    product.save().then(
        ()=>{
           res.status(403).json({
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
       Product.find({}).then(
        (productList)=>{
          res.json(
            productList
          )
        
       })
   } 

export function deleteProduct(req,res){
    if(!isAdmin(req)){
        res.status(403).json({
           message:"login as admin to delete the product"
        })
        return
     }
     const productId=req.params.productId
     Product.deleteOne({productId:productId}).then(
        ()=>{
            res.json({
                message:"product deleted"
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
// update the product function
export function updateProduct(req,res){
    if(!isAdmin(req)){
        res.status(403).json({
           message:"login as admin to update the product"
        })
        return
     }
     const productId=req.params.productId
     const newProductData=req.body
     Product.updateOne({productId:productId},
     newProductData
     ).then(
        ()=>{
            res.json({
                message:"product updated"
            })
        }
     ).catch(
        (error)=>{
    res.status(403).json({
   message:error
})
        }
     )
     }
