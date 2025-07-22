import express from "express";
import mongoose from "mongoose";
import connectDB from "./utils/connDB.js";
import todoRouter from "./routes/todo.routes.js";
import router from "./routes/auth.routes.js";
import { authMiddleware } from "./middlewares/auth.middleware.js";
import dotenv from "dotenv";
dotenv.config(); 

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());        

connectDB();

app.get("/" , (req,res) => {    
    res.send("Hello World!");
})

app.use("/api/auth", router); 
app.use("/api/todos", authMiddleware, todoRouter);

app.listen(PORT , () => {
    console.log(`Server is running on port ${PORT}`);
});



