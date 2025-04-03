



import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config()

const VideoPostSchema = new mongoose.Schema({
    title:{
        type:String,
    },
    
    video: {
    
        type: String,
       // required: true,
    },
    photo:{
      type: String,
    },
  
    category: {
        type: String,
        required: true,
      },
     about: {
        type: String,
        required: true,
      
      },
      like:[{type:mongoose.Schema.Types.ObjectId, ref:'User'}],

    likeCount: {
        type: Number,
        default: 0
    },
      adminName: {
        type: String,
      },
      adminPhoto: {
        type: String,
      },
      comments:[{type:mongoose.Schema.Types.ObjectId, ref:'Comment'}],

     createdby: {   
           type: mongoose.Schema.Types.ObjectId,
           ref: 'User',
          
    },
    
},{timestamps:true});

// userSchema.methods.generateToken=function(){

//     try {
//      return jwt.sign({
   
//       userId:this._id.toString(),
//      email:this.email,
//       //isAdmin:this.isAdmin
//       // nid:this.nid
//      },
     
//    process.env. JWT_SECRECT_KEY,
//    {
//      expiresIn:"30d"
//    }
   
//    )
//     } catch (error) {
//      console.log(error)
//     }
   
//    }


export const videolist = mongoose.model('videopost',VideoPostSchema);














