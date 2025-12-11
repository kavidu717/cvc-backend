import express from "express";

import { createProduct, getProducts } from "../controller/productController.js";

// create the student router
const productRouter=express.Router()

productRouter.get("/",getProducts)

productRouter.post("/",createProduct)

export default productRouter;