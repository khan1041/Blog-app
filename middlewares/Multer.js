
import express from 'express'
import multer from 'multer'
import path from 'path'
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uplods')
    },
    filename: function (req, file, cb) {
    
      cb(null, `image-${Date.now()}. ${file.originalname}`)
    }
  })
  
  //img
  const isImage=(req,file,cb)=>{

    if(file.mimetype.startsWith("image")){

      cb(null,true)
    }
    else{
      cb(new Error("only image is allowd"))
    }


  }


  const upload = multer({ 
    
    
    storage: storage,
     fileFilter:isImage

   })

export default upload
