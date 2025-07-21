import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async  () => {
   await mongoose.connect(process.env.MONGO_URI  )
    .then(() => console.log("Database connected!"))
    .catch(console.error("Unable to connect DB!"))
}

export default connectDB;