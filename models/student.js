import mongoose from "mongoose" 

        const studentSchema=mongoose.Schema({
            name:String,
            age:Number,
            gender:String

        })
        // students meand collection name
        const Student=mongoose.model("students",studentSchema)

        export default Student