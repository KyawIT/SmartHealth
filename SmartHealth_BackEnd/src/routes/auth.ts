import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();
const ACCESS_TOKEN_SECRET: jwt.Secret = process.env
  .ACCESS_TOKEN_SECRET as string;
interface User {
  username: string;
  password: string;
  svn: string;
}
const users: User[] = [
  {
    username: "user1",
    password: "$2b$10$5zF5Z2t7Z6dMvC1mL8Z1Ae9U0aQ8J7J0KJX3VxV1Kb7y4p3Z8aX8S",
    svn: "123456",
  },
  {
    username: "user2",
    password: "$2b$10$5zF5Z2t7Z6dMvC1mL8Z1Ae9U0aQ8J7J0KJX3VxV1Kb7y4p3Z8aX8S",
    svn: "123456",
  },
];

const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10; // Adjust salt rounds as needed
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

router.get("/", (req, res) => {
  res.send("User Home Page");
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);
  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid username or password" });
  }
  const payload = { username };
  const token = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });

  res.json({ token });
});

router.post("/register", async (req, res) => {
  const { username, password, svn } = req.body;

  const existingUser = users.find((u) => u.username === username);
  if (existingUser) {
    return res.status(400).json({ message: "Username already exists" });
  }

  const hashedPassword = await hashPassword(password);

  users.push({ username, password: hashedPassword, svn });

  const payload = { username }; // Optional payload for registration token
  const token = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
  if (token) {
    res.json({ message: "User registered successfully", token });
  } else {
    res.json({ message: "User registered successfully" });
  }
});

export default router;
