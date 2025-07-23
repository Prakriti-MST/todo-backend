import fs from "fs";
import path from "path";
import express from "express";
import mongoose from "mongoose";
import connectDB from "./config/connDB.js";

import todoRouter from "./routes/todo.routes.js";
import authRouter from "./routes/auth.routes.js";
import { authMiddleware } from "./middlewares/auth.middleware.js";

import swaggerUi from "swagger-ui-express";
const swaggerPath = path.resolve("./swagger.json");
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, "utf-8"));

import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

connectDB();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth", authRouter);
app.use("/api/todos", authMiddleware, todoRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}. Docs at /api-docs`);
});
