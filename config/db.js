import mongoose from 'mongoose';
export const connectDB = async ()=>{
    try{
        const con = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MONGODB Connected: ${con.connection.host}`)
    }catch (error){
        console.error(`Error:${error.message}`)
        process.exit(1);
    }
}