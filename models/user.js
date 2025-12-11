import mongoose from "mongoose";

const userSchema=mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    firstName:{
        type:String,
        required:true
    },
     lastName:{
        type:String,
        required:true
    },
     password:{
        type:String,
        required:true
    },
    isBlock:{
        type:Boolean,
        default:false
    },

     type:{
        type:String,
       default:"customer"
    },
    profilePicture:{
       type:String,
       default: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freepik.com%2Ffree-photos-vectors%2Fuser-profile&psig=AOvVaw1546sj7gwkHy8BicdXorOf&ust=1765383464835000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCPDbiYr0sJEDFQAAAAAdAAAAABAE"
    }

})
 const User=mongoose.model("users",userSchema)

 export default User