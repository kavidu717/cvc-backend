import Order from "../models/order.js";
import { isAdmin, isCustomer } from "./userController.js";
import Product from "../models/product.js";
import Stripe from "stripe";

function getStripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

function getFrontendBaseUrl(req) {
  return process.env.FRONTEND_URL || req.headers.origin || "http://localhost:5173";
}

function getStripeAmount(amount) {
  return Math.round(Number(amount) * 100);
}



export async function createOrder(req,res){

   if(!isCustomer(req)){
      return res.status(401).json({
        message:"login as customer to create the order"
      })
   }

    try{
     if(!Array.isArray(req.body?.orderItems) || req.body.orderItems.length === 0){
      return res.status(400).json({
        message:"order items are required"
      })
     }

     if(!req.body?.name || !req.body?.address || !req.body?.phone){
      return res.status(400).json({
        message:"name, address and phone are required"
      })
     }

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
          const currentItem = newOrderData.orderItems[i]

          if(!currentItem?.productId || !currentItem?.qty || currentItem.qty <= 0){
            return res.status(400).json({
              message:"invalid order item"
            })
          }
          
           const product= await Product.findOne(
            {
                productId:currentItem.productId
            }
           )
          if(product==null){
           return res.status(404).json({
               message:"product not found"
           })
          }

            newProductArray[i]={
              name:product.productName,
              price:product.lastPrice,
              quentity:currentItem.qty,
              image:product.image?.[0] ?? ""
              

            }


       }
        newOrderData.orderItems=newProductArray



        newOrderData.orderId=orderId
        newOrderData.email=req.user.email
        newOrderData.paymentStatus="unpaid"

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
    res.status(401).json({
        message:"login as customer or admin to get the order"
    })
 }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function createStripeCheckoutSession(req, res) {
  if (!isCustomer(req)) {
    return res.status(401).json({
      message: "login as customer to continue payment"
    });
  }

  try {
    const order = await Order.findOne({
      orderId: req.params.orderId,
      email: req.user.email
    });

    if (!order) {
      return res.status(404).json({
        message: "order not found"
      });
    }

    if (!Array.isArray(order.orderItems) || order.orderItems.length === 0) {
      return res.status(400).json({
        message: "order items are required for payment"
      });
    }

    const stripe = getStripeClient();
    const frontendBaseUrl = getFrontendBaseUrl(req);
    const currency = (process.env.STRIPE_CURRENCY || "usd").toLowerCase();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: order.email,
      metadata: {
        orderId: order.orderId,
        email: order.email
      },
      line_items: order.orderItems.map((item) => ({
        price_data: {
          currency,
          product_data: {
            name: item.name
          },
          unit_amount: getStripeAmount(item.price)
        },
        quantity: Number(item.quentity ?? item.quantity ?? 0)
      })),
      success_url: `${frontendBaseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}&orderId=${encodeURIComponent(order.orderId)}`,
      cancel_url: `${frontendBaseUrl}/payment/cancel?orderId=${encodeURIComponent(order.orderId)}`
    });

    order.stripeSessionId = session.id;
    await order.save();

    return res.json({
      url: session.url,
      sessionId: session.id
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}

export async function verifyStripeCheckoutSession(req, res) {
  const sessionId = req.query.session_id;

  if (!sessionId) {
    return res.status(400).json({
      message: "session_id is required"
    });
  }

  try {
    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const orderId = session.metadata?.orderId;

    if (!orderId) {
      return res.status(400).json({
        message: "order metadata is missing from stripe session"
      });
    }

    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({
        message: "order not found"
      });
    }

    if (session.payment_status !== "paid") {
      return res.status(400).json({
        message: "payment is not completed",
        paymentStatus: session.payment_status
      });
    }

    order.paymentStatus = "paid";
    order.paymentId = typeof session.payment_intent === "string" ? session.payment_intent : order.paymentId;
    order.stripeSessionId = session.id;
    await order.save();

    return res.json({
      message: "payment verified",
      order
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
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
