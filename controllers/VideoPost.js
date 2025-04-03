
import mongoose, { mongo } from "mongoose";
import { videolist } from "../models/VideoPostScema.js";
import { User } from "../models/UserScema.js";
import { Comment } from "../models/CommentScema.js";
import dotenv from 'dotenv'

import { v2 as cloudinary } from "cloudinary";
import { promise } from "zod";
 dotenv.config()

export const videopost=async(req,res)=>{

    try {
          const author=req.user._id

      const { title, category, about } = req.body;
      const{video}=req.files
      if (!title ) {
        return res
          .status(400)
          .json({ message: "title, category & about are required fields" });
      }

        //   const cloudinaryResponse = await cloudinary.uploader.upload(
        //     blogImage.tempFilePath
        //   );

   const cloudinaryResponse= await cloudinary.uploader.upload(req.files.video.tempFilePath,{
  resource_type:'auto'
   })
console.log(cloudinaryResponse)

          if (!cloudinaryResponse || cloudinaryResponse.error) {
            console.log(cloudinaryResponse.error);
          }


          const adminName = req.user.username;
          const adminPhoto = req.user.photo;
          const createdBy = req.user._id;

          const blogData= {
            title,
            about,
            category,
             adminName,
             adminPhoto,
             createdby:createdBy,
             
            video:cloudinaryResponse.secure_url,    

            
          }

         
        console.log(blogData)
        const blog = await videolist.create(blogData);

       const user = await User.findById(author);
          if (user) {
              user.posts.push(blog._id);
              await user.save();
          }
          res.status(201).json({
            message: "Blog created successfully",
            blog,
          });
        } catch (error) {
          console.log(error);
          return res.status(500).json({ error: "Internal Server error" });
        }}



//frinds post suggest

export const friendpost=async(req,res)=>{

  try {

  } catch (error) {
  
  }}




export const allvideos=async(req,res)=>{

try {

    const videoGet=await videolist.find()
    return res.status(200).json(videoGet)



} catch (error) {
console.log(error)
}

}

//mypost
export const mypost=async(req,res)=>{
try {
  const createdby=req.user._id
  const mycreated=await videolist.find({createdby}) 
  res.status(200).json(mycreated)

} catch (error) {
  console.log(error)
}}

//find singalepost videos
export const singalepost=async(req,res)=>{

  try {
    const reid= req.params.id;
    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //   return res.status(400).json({ message: "Invalid Blog id" });
    // }
    const blog = await videolist.find({createdby:reid});
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json(blog);
  }
  
    
   catch (error) {
    console.log(error)
  }

}

//likePoat 

export const like=async(req,res)=>{

try {
  const  createdby=req.user.id
  const postId=req.params.id
  const post=await videolist.findById(postId)
  
   if(!post){
    return res.status(404).json({msg:"post not found"})
   }

  const nodejs=await User.findById(createdby)

  if(!nodejs){
    return res.status(404).json({msg:"user not found"})
  }
  

 await post.updateOne({$addToSet:{like:createdby}})
  await post.save()
  await nodejs.save()
 return res.status(200).json({post})

} catch (error) {
  console.log(error)
}

}

//dislike post

export const dislike=async(req,res)=>{

  try {
    const  createdby=req.user._id
    const postId=req.params.id
  
    const post=await videolist.findById(postId)
  
    if(!post){
      return res.status(404).josn({msg:"post not found"})
    }
  
    const nodejs=await User.findById(createdby) 
  
    if(!nodejs){
      return res.status(404).json({msg:"user not found"})
    }
  
  await post.updateOne({$pull:{like:createdby}})

  await post.save()
  return res.status(200).json({msg:"dislike"})
  } catch (error) {
    console.log(error)
  }
  
  }


  //follow or unfollow

  export const followofunfollow=async(req,res)=>{

try {
  const followId=req.user._id
  const followingId=req.params.id
  if(followId===followingId){
    return res.status(200).json({msg:"this is yourId"})
  }

const user=await User.findById(followId).populate("followers")
const targaetUser=await User.findById(followingId).populate("followers")

if(!user||!targaetUser){
  return res.status(404).json({msg:"user not found"})
}
//const targaetUser=await User.findById(followingId).populate("followers")


const idfollowing=user.following.includes(followingId)
 if(idfollowing){
  await Promise.all([
  User.updateOne({_id:followId},{$pull:{following:followingId}}),
  User.updateOne({_id:followingId},{$pull:{followers:followId}})
  ])
  return res.status(200).json({msg:"unfollow done"})
  
}
else{
  await Promise.all([

    User.updateOne({_id:followId},{$push:{following:followingId}}),
    User.updateOne({_id:followingId},{$push:{followers:followId}}),

  ])
  return res.status(200).json({msg:"follow"})

}


} catch (error) {
  console.log(error)
}}



//delete fraind request
export const fariendRequest=async(req,res)=>{

  try {
 
  } catch (error) {
    console.log(error)
  }
  
  }

  //comment users
export const addcomment=async(req,res)=>{

  try {
     const postId=req.params.id
     const userId=req.user._id
     const{text}=req.body

const post=await videolist.findById(postId)

if(!text) return res.status(400).json({message:'text is required', success:false});

const comment=await Comment.create({
  text,
  author:userId,
  post:postId
})

await comment.populate({
  path:'author',
  select:"username photo"

})

post.comments.push(comment._id)
await post.save()

return res.status(201).json({
  message:'Comment Added',
  comment,
  
  success:true
})
  } catch (error) {
    console.log(error)  
  }}

//getall comment

export const getCommentsOfPost = async (req,res) => {
  try {
      const postId = req.params.id;
      const userId=req.user._id

      const comments = await Comment.find({post:postId}).populate('author', 'username photo');

   

      if(!comments) return res.status(404).json({message:'No comments found for this post', success:false});

      return res.status(200).json({success:true,comments});

  } catch (error) {
      console.log(error);
  }
}


//comments

 export const mycomment=async(req,res)=>{

try {
  const postId=req.params.id
  const userId=req.user._id

  const params=await videolist.findById(postId)

  if(!params){
    return res.status(401).josn({msg:"post not found"})
  }

  const mycomment=await Comment.find({author:userId})


      if(!mycomment) return res.status(404).json({message:'No comments found for this post', success:false});

      return res.status(200).json({success:true,myId});


} catch (error) {
  console.log(error)
  
}

 }







