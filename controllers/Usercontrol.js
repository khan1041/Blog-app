



import { User } from "../models/UserScema.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

 dotenv.config()
 import { v2 as cloudinary } from "cloudinary";
import { videolist } from "../models/VideoPostScema.js";

export const ragister=async(req,res)=>{


try {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ message: "User photo is required" });
  }
  const { photo } = req.files;
  // const allowedFormats = ["image/jpeg", "image/png", "image/webp"];
  // if (!allowedFormats.includes(photo.mimetype)) {
  //   return res.status(400).json({
  //     message: "Invalid photo format. Only jpg and png are allowed",
  //   });
  // }
  const { email, username, password,role } = req.body;
  if (
    !email ||
    !username ||
    !password ||       
    !photo
  ) {
    return res.status(400).json({ message: "Please fill required fields" });
  }
  const user = await User.findOne({ email });
  if (user) {
    return res
      .status(400)
      .json({ message: "User already exists with this email" });
  }


  const cloudinaryResponse = await cloudinary.uploader.upload(
    photo.tempFilePath
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.log(cloudinaryResponse.error);
  }
  const hashedPassword = await bcrypt.hash(password, 10);


  const newUser = new User({
    email,
    username,
    password: hashedPassword,
    role,
    photo:cloudinaryResponse.secure_url,
    
  });
  const userreg= await newUser.save();
   return res.status(201).json({msg:"completed",userreg})
    // console.log(req.body)
  //  const video= await cloudinary.uploader.upload(req.files.photo.tempFilePath,{
  //   resource_type:'video'
  //  })
  //    console.log(video)


    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Internal Server error" });
    }
    
}


//Myprofile

export const Myprofile=async(req,res)=>{

  try {
    const user=req.user
    console.log(user)
    res.status(200).json(user)
  } catch (error) {
    console.log(error)
  }


}


//get user
export const alluser=async(req,res)=>{

    try {
        const alldatafind=await User.find()//.populate("bookmarks")
        
        return res.status(200).json(alldatafind)
    } catch (error) {
        console.log(error)
    }
    
    }

//--singaleId
export const singaleuser=async(req,res)=>{

  try {
    const viewId=req.params.id

    const viewuser=await User.findById(viewId)
    if(!viewuser){
return res.status(200).json({msg:"user id not found"})
    }
    return res.status(200).json({msg:"view user",viewuser})
    
  } catch (error) {
    console.log(error)
  }


}

//Login--//

export const Login=async(req,res)=>{

try {
    const { email, password } = req.body;
        
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        };
       // check role is correct or not
        return res.status(200).json({msg:"login done",token:await user.generateToken(),
      userId:user._id
 })
     
   
 
} catch (error) {
    console.log(error)
}}




//UPDATE USER image profie
export const updateProfile = async (req, res) => {
    try {
     // const { email, username, password,role } = req.body;
     const userId = req.user._id;
     const{username,password}=req.body
     const update=await User.findById(userId)

//      const cloudinaryResponse = await cloudinary.uploader.upload(
//   photo.tempFilePath
  
// );
const hashedPassword = await bcrypt.hash(password, 10);

     if(!update){
      return res.status(400).json({msg:"not userId"})
     }
     if(username){
      update.username=username
     }
     if(password){
      update.password=hashedPassword
     }

//      if(photo){
//     update.photo=cloudinaryResponse.secure_url

//  }
   
     await update.save()
     return res.status(200).json({msf:"done updated",update})
    } catch (error) {

        console.log(error);
    }
}


//all admin users



//update image
export const updateimage=async(req,res)=>{

  try {
    const userId = req.user._id;
    const {photo}=req.files;

    const cloudinaryResponse = await cloudinary.uploader.upload(
        photo.tempFilePath
        
    );
    const update=await User.findById(userId)

    if(photo){
        update.photo=cloudinaryResponse.secure_url
      
        }
        await update.save()
        return res.status(200).json({msg:"imgage update",update})
  } catch (error) {
    console.log(error)
  }


}


///

export const getSuggestedUsers = async (req, res) => {
  try {
    const authorId=req.user._id
//  const whofollowing=await User.findById({following:authorId})

      const suggestedUsers = await User.find({ _id: { $ne:authorId }}).select("-password");
      if (!suggestedUsers) {
          return res.status(400).json({
              message: 'Currently do not have any users',
          })
      };
      return res.status(200).json(
        suggestedUsers
      )
  } catch (error) {
      console.log(error);
  }
};

export const adminlist=async(req,res)=>{

try {
  const adminget=await User.find({role:'admin'})
  return res.status(200).json({msg:"list admin",adminget})
} catch (error) {
  
}

}

//BookMark
export const BookMark=async(req,res)=>{
  try {
    const PostId=req.params.id
    const authorId=req.user._id

const post=await videolist.findById(PostId)

if(!post){
  return res.status(400).json({msg:"post not found"})
}
const user=await User.findById(authorId)

if(!user){
return res.status(400).json({msg:"user not found"})
}

if(user.bookmarks.includes(post._id)){

  await user.updateOne({$pull:{bookmarks:post._id}})
await user.save()
return res.status(200).json({msg:"pull down"})
}
else{
  await user.updateOne({$addToSet:{bookmarks:post._id}})
  await user.save()
  return res.status(200).json({msg:"add done"})
}

  } catch (error) {
    console.log(error)
  }
 
}

//all bookmark lis
export const bookmarkList=async(req,res)=>{

  try {
  const userId=req.user._id
  const hour=await User.findById(userId).populate('bookmarks')
  return res.status(200).json(hour)
   //console.log(userId.bookmarks)


  }catch (error) {
    console.log(error)
  }

}

//folower
export const myfollowing=async(req,res)=>{

try {
  const authorId=req.user._id
  const findfollow=await User.find({followers:authorId})//.populate("following")
  console.log(findfollow)
  return res.status(200).json(findfollow)
} catch (error) {
  console.log(error)
}}





