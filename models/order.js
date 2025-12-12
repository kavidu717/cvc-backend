import mongoose from "mongoose";
// create order schema

 const orderSchema=mongoose.Schema({
    orderId:{
        type:String,
        require:true,
        unique:true
    },
     email:{
        type:String,
        require:true,
       // unique:true
    },
     orderItems:[
        {
            name:{
                type:String,
                required:true
            },
           price :{
               type:Number,
                required:true
            },
             quentity :{
               type:Number,
                required:true
            },
             image :{
               type:String,
                required:true
            },
        }
     ],
     date: {
        type:Date,
        default:Date.now
     },
     paymentId:{
        type:String,
       // require:true
     },
     notes:{
        type:String,
        require:true
     }, 
     status:{
        type:String,
        default:"pending" 
     },
     name:{
        type:String,
          require:true
     },
      address:{
        type:String,
          require:true
     },
      phone:{
        type:String,
          require:true
     }


 })

const Order=mongoose.model("orders",orderSchema);
export default Order
