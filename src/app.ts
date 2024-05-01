import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { userRouter } from "./routes/usersRoutes.js";
import morgan from "morgan";

const app = express();

app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection:", reason);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
  process.exit(1);
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed.");
  process.exit(0);
});

app.use(express.json());
app.use(morgan("dev"));
app.use("/users", userRouter);

app.get("/", (req, res) => {
  res.send("hello world");
});
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.status ?? 500;
  const errorResponse: Record<string, any> = {
    message: err.message,
    status,
  };
  if (process.env.NODE_ENV === "development") {
    errorResponse.stack = err.stack;
    if (err.info) {
      errorResponse.info = err.info;
    }
  }
  res.status(status).json({ error: errorResponse });
});

export { app };
