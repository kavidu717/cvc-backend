import mongoose from "mongoose" 

        const productSchema=mongoose.Schema({
            name:String,
            price:Number,
            description:String

        })
        // students meand collection name
        const Product=mongoose.model("products",productSchema)

        export default Product