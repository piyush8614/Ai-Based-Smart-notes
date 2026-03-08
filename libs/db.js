import mongoose from "mongoose";

const Dbcon=async()=>{
    try {
       mongoose.connect(process.env.MONGO_URL)
       .then(()=>{
        console.log("DataBase Connected Successfully");
       })
    } catch (error) {
        console.log("DataBase Connection Failed",error);
    }
}
 export default Dbcon;