
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
const uri=process.env. mongo_url
const conectedDb=async ()=>{
    try {
        await mongoose.connect(uri)
        console.log("conceted done to db")
    } catch (error) {
        console.error("database connected faill")
        process.exit(0)
    }}
export default conectedDb


