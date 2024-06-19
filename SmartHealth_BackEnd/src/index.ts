import express from "express";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import authRouter from "./routes/auth";
import cors from "cors";
import emailRouter from "./routes/email";

dotenv.config();

const app = express();
const corsOptions = {
  origin: "http://localhost:5173", // Replace with your actual frontend URL
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Allow cookies and authorization headers
};
app.use(cors(corsOptions));
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use("/auth", authRouter);
app.use("/email", emailRouter);
app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
