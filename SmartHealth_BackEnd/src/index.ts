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
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
}));
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
