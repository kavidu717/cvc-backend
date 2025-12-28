import Order from "../models/order.js";
import { isAdmin, isCustomer } from "./userController.js";
  import Product from "../models/product.js";



  export async function createOrder(req,res){

   if(!isCustomer){
      res.json({
        message:"login as customer to create the order"
      })
   }

    try{
     const latestOrder= await Order.find().sort({date: -1}).limit(1)
      let orderId

      if(latestOrder.length==0){
          orderId="CBC0001"
      } else{
          const currentOrderId= latestOrder[0].orderId

          const numberString=currentOrderId.replace("CBC","")

       const number=parseInt(numberString)
       const newNumber=(number+1).toString().padStart(4,"0")
         orderId="CBC"+newNumber
      }
      
      const newOrderData=req.body
      const newProductArray=[]
        
       for(let i=0;i<newOrderData.orderItems.length;i++){
          // console.log(newOrderData.orderItems[i]);
          
           const product= await Product.findOne(
            {
                productId:newOrderData.orderItems[i].productId
            }
           )
          if(product==null){
           res.json({
               message:"product not found"
           })
           return
          }

            newProductArray[i]={
              name:product.productName,
              price:product.lastPrice,
              quentity:newOrderData.orderItems[i].qty,
              image:product.image[0]
              

            }


       }
       console.log(newProductArray);

        newOrderData.orderItems=newProductArray



        newOrderData.orderId=orderId
        newOrderData.email=req.user.email

       const order = new Order(newOrderData)



        const savedOrder=await order.save()
       res.json({
        message:"order created",
        order:savedOrder
       })
         

        



    }catch(error){
      res.status(500).json({
        message:error.message
      })
    }
  }
 export async function getOrder(req, res) {
  try {
    if(isCustomer(req)){

   
    const orders = await Order.find({ email: req.user.email });
    res.json(orders);
    return;
 }else if(isAdmin(req)){
   
  const orders = await Order.find();
  res.json(orders);
  return

 }else{
    res.json({
        message:"login as customer or admin to get the order"
    })
 }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
 
/// get the product details

export async function getProductById(req, res) {
try{
  const productId = req.params.productId;
  const product = await Product.findOne({ productId: productId });
  res.json(product);
}catch(e){
  res.status(500).json({ 
    e

}
    )
    }
   }


  export async function getQuote(req, res) {
  try {
    const { orderItems } = req.body;

    let total = 0;
    let labelTotal = 0;
    const newProductArray = [];

    for (let i = 0; i < orderItems.length; i++) {
      const product = await Product.findOne({
        productId: orderItems[i].productId
      });

      if (!product) {
        return res.status(404).json({ message: "product not found" });
      }

      labelTotal += product.price * orderItems[i].qty;
      total += product.lastPrice * orderItems[i].qty;

      newProductArray.push({
        name: product.productName,
        price: product.lastPrice,
        labelPrice: product.price,
        quantity: orderItems[i].qty,
        image: product.image[0]
      });
    }

    res.json({
      orderItems: newProductArray,
      total,
      labelTotal
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
