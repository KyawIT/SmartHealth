import express from "express";
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

interface User {
  email: string;
  password: string;
  svn: string;
  displayName?: string;
  photos?: string;
}
dotenv.config();
const router = express.Router();
router.use(session({
  secret: process.env.SESSION_SECRET || 'default_session_secret',
  resave: false,
  saveUninitialized: false
}));

router.use(passport.initialize());
router.use(passport.session());

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  callbackURL: process.env.GOOGLE_CALLBACK_URL || ''
}, (accessToken, refreshToken, profile, done) => {
  console.log('Google profile:', profile);
  done(null, profile);
}));

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID || '',
  clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
  callbackURL: process.env.GITHUB_CALLBACK_URL || ''
}, (accessToken, refreshToken, profile, done) => {
  console.log('Github profile:', profile);
  done(null, profile);
}));

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user:any, done) {
  done(null, user);
});


const ACCESS_TOKEN_SECRET: jwt.Secret = process.env
  .ACCESS_TOKEN_SECRET as string;

const users: User[] = [];

const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10; // Adjust salt rounds as needed
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);
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
  const { email, password, svn } = req.body;

  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: "Username already exists" });
  }

  const hashedPassword = await hashPassword(password);

  users.push({ email, password: hashedPassword, svn });

  const payload = { email, svn }; // Optional payload for registration token
  const token = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
  if (token) {
    res.json({ message: "User registered successfully", token });
  } else {
    res.json({ message: "User registered successfully" });
  }
});

function verifyToken(req:any, res:any, next:any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token not provided' });
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err:any, decoded:any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = decoded;
    next(); // Proceed to next middleware or route handler
  });
}

// GOOGLE
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  res.redirect('http://localhost:5173/');
});

// GITHUB
router.get('/github', passport.authenticate('github'));
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
  res.redirect('http://localhost:5173/');
});

router.get('/profile', (req, res) => {
  if(req.isAuthenticated() && req.user){
    res.json(req.user);
  }
});

router.get('/', (req, res) => {
  res.send('User Home Page');
});

export default router;
