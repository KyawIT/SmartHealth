import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { DB } from "../../db/scripts/users_db";

interface User {
  email: string;
  password: string;
  display_name: string;
  photo_url: string;
}

dotenv.config();
const router = express.Router();
router.use(
  session({
    secret: process.env.SESSION_SECRET || "default_session_secret",
    resave: false,
    saveUninitialized: false,
  })
);

router.use(passport.initialize());
router.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "",
    },
    (accessToken, refreshToken, profile, done) => {
      console.log("Google profile:", profile);
      done(null, profile);
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      callbackURL: process.env.GITHUB_CALLBACK_URL || "",
    },
    (accessToken, refreshToken, profile, done) => {
      console.log("Github profile:", profile);
      done(null, profile);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user: any, done) {
  done(null, user);
});

const ACCESS_TOKEN_SECRET: jwt.Secret = process.env
  .ACCESS_TOKEN_SECRET as string;

const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10; // Adjust salt rounds as needed
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user: User | null = await GetUserByEmailFromDB(email);
  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid username or password" });
  }
  const payload = { email };
  const token = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });

  res.json({ token });
});

router.post("/register", async (req, res) => {
  const { email, password, display_name, photo_url } = req.body;

  const existingUser: User | null = await GetUserByEmailFromDB(email);
  if (existingUser) {
    return res.status(400).json({ message: "Username already exists" });
  }

  const hashedPassword = await hashPassword(password);
  const user: User = {
    email,
    password: hashedPassword,
    display_name: display_name,
    photo_url: photo_url,
  };

  await InsertUserToDB(user);

  const payload = { user }; // Optional payload for registration token
  const token = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
  if (token) {
    res.json({ message: "User registered successfully", token });
  } else {
    res.json({ message: "User registered successfully" });
  }
});

function verifyToken(req: any, res: any, next: any) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token not provided" });
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = decoded;
    next(); // Proceed to next middleware or route handler
  });
}

function ensureAuthenticated(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

async function InsertUserToDB(user: User) {
  const db = await DB.createDBConnection();
  try {
    const stmt = await db.prepare(
      "INSERT INTO USERS (email, password, display_name, photo_url) VALUES (?1, ?2, ?3, ?4)"
    );
    await stmt.bind({
      1: user.email,
      2: user.password,
      3: user.display_name,
      4: user.photo_url,
    });
    const operationResult = await stmt.run();
    await stmt.finalize();
    return operationResult; // Optionally return the result of the operation
  } catch (error) {
    console.error("Error inserting user:", error);
    throw error;
  } finally {
    await db.close();
  }
}

async function GetAllUsersFromDB(): Promise<User[]> {
  const db = await DB.createDBConnection();
  try {
    const stmt = await db.prepare(
      "SELECT email, password, display_name, photo_url FROM USERS"
    );
    const result = await stmt.all();
    await stmt.finalize();
    return result;
  } catch (error) {
    console.error("Error retrieving users:", error);
    throw error;
  } finally {
    await db.close();
  }
}

async function GetUserByEmailFromDB(email: string): Promise<User | null> {
  const db = await DB.createDBConnection();
  try {
    const stmt = await db.prepare(
      "SELECT email, password, display_name, photo_url FROM USERS WHERE email = ?"
    );
    await stmt.bind([email]);
    const result = await stmt.get();
    await stmt.finalize();
    return result || null;
  } catch (error) {
    console.error("Error retrieving user by email:", error);
    throw error;
  } finally {
    await db.close();
  }
}

// GOOGLE
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("http://localhost:5173/");
  }
);

// GITHUB
router.get("/github", passport.authenticate("github"));
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("http://localhost:5173/");
  }
);

router.get("/profile", (req, res) => {
  if (req.isAuthenticated() && req.user) {
    res.json(req.user);
  }
});

router.get("/", (req, res) => {
  res.send("User Home Page");
});

export default router;
