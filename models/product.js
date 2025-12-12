import mongoose from "mongoose";

const productSchema=mongoose.Schema({

productId:{
    type:String,
    unique:true,
    required:true
},
productName:{
    type:String,
    required:true
},
altName:[
{
    type:String,
    
}   
],
image:[
{
    type:String,  
}   
],
price:{
    type:Number,
    required:true
},
lastPrice:{
    type:Number,
    required:true
},
stock:{
    type:Number,
    required:true
},
description:{
    type:String,
    required:true
},

})
const Product=mongoose.model("products",productSchema);

 export default Product