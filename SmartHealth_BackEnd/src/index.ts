import express from "express";
import { User, users } from "./user";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
  res.status(StatusCodes.OK).json(users);
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);
  if (!user) {
    res.status(StatusCodes.UNAUTHORIZED).send("User not found");
    return;
  }

  const accToken = jwt.sign(user, "TEST");
  res.status(StatusCodes.OK).json(accToken);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
