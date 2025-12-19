import express from "express";
import { createProduct, getProduct,deleteProduct, updateProduct } from "../controller/productController.js";
import { getProductById } from "../controller/orderController.js";

const productRouter =express.Router()

productRouter.post("/",createProduct)
productRouter.get("/",getProduct)
productRouter.get("/:productId",getProductById)
productRouter.delete("/:productId",deleteProduct)
productRouter.put("/:productId",updateProduct)




export default productRouter