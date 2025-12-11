 import Product from "../models/product.js"  
  
  
  export function getProducts(req,res){
         Product.find().then(
    (productlist)=>{
res.json({
     list: productlist
})
    }
   )

    }
  
     export function createProduct(req,res){
        console.log(req.user)

        if(req.user==null){
         res.json({
            message:"you are not login in"
         })
         return
        }

        if(req.user.type!="admin"){
             res.json({
            message:"you are not admin"
         })
         return
        }

         const newstudent=new Product(req.body)
      newstudent.save().then(
        ()=>{
            res.json({
                message:"product created"
            }
       ) }
      )
  }