import mongoose from "mongoose";
const connectDB=async()=>{
    try{
        mongoose.connection.on('connected',
            ()=>console.log("Datbase Connected")); 
await mongoose.connect(`${process.env.MONGODB_URL}/quickblog`);
    }
    catch(error){
console.log(error.message);
    }
}

export default connectDB;




