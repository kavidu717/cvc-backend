import express from "express";
import { createOrder,getOrder,getQuote, createStripeCheckoutSession, verifyStripeCheckoutSession } from "../controller/orderController.js";


const orderRouter =express.Router()

orderRouter.post("/",createOrder)
orderRouter.get("/",getOrder)
orderRouter.post("/quote",getQuote)
orderRouter.post("/:orderId/stripe-session",createStripeCheckoutSession)
orderRouter.get("/stripe/verify",verifyStripeCheckoutSession)






export default orderRouter
