import fs from "fs";
import path from "path";
import express from "express";
import cors from "cors";
import connectDB from "./config/connDB";

import todoRouter from "./routes/todo.routes";
import authRouter from "./routes/auth.routes";
import { authMiddleware } from "./middlewares/auth.middleware";

// import swaggerUi from "swagger-ui-express";
// const swaggerPath = path.resolve("../swagger.json");
// const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, "utf-8"));

import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    const app = express();

    app.use(cors());
    app.use(express.json());
    // app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    app.get("/", (req, res) => {
      res.send("Hello World!");
    });

    app.use("/api/auth", authRouter);
    app.use("/api/todos", authMiddleware, todoRouter);

    app.listen(PORT, async () => {
      console.log(`Server is running on port ${PORT}`);
      await connectDB();
    });
  } catch (err) {
    console.error(" Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
