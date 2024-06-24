"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_github_1 = require("passport-github");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const users_db_1 = require("../../db/scripts/users_db");
dotenv_1.default.config();
const router = express_1.default.Router();
router.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || "default_session_secret",
    resave: false,
    saveUninitialized: false,
}));
router.use(passport_1.default.initialize());
router.use(passport_1.default.session());
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "",
}, (accessToken, refreshToken, profile, done) => {
    console.log("Google profile:", profile);
    done(null, profile);
}));
passport_1.default.use(new passport_github_1.Strategy({
    clientID: process.env.GITHUB_CLIENT_ID || "",
    clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    callbackURL: process.env.GITHUB_CALLBACK_URL || "",
}, (accessToken, refreshToken, profile, done) => {
    console.log("Github profile:", profile);
    done(null, profile);
}));
passport_1.default.serializeUser(function (user, done) {
    done(null, user);
});
passport_1.default.deserializeUser(function (user, done) {
    done(null, user);
});
const ACCESS_TOKEN_SECRET = process.env
    .ACCESS_TOKEN_SECRET;
const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const saltRounds = 10; // Adjust salt rounds as needed
    const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
    return hashedPassword;
});
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield GetUserByEmailFromDB(email);
    if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
    }
    const isMatch = yield bcrypt_1.default.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid username or password" });
    }
    const payload = { email };
    const token = jsonwebtoken_1.default.sign(payload, ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
    });
    res.json({ token });
}));
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, display_name, photo_url } = req.body;
    const existingUser = yield GetUserByEmailFromDB(email);
    if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
    }
    const hashedPassword = yield hashPassword(password);
    const user = {
        email,
        password: hashedPassword,
        display_name: display_name,
        photo_url: photo_url,
    };
    yield InsertUserToDB(user);
    const payload = { user }; // Optional payload for registration token
    const token = jsonwebtoken_1.default.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
    if (token) {
        res.json({ message: "User registered successfully", token });
    }
    else {
        res.json({ message: "User registered successfully" });
    }
}));
function verifyToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Access token not provided" });
    }
    jsonwebtoken_1.default.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token" });
        }
        req.user = decoded;
        next(); // Proceed to next middleware or route handler
    });
}
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}
function InsertUserToDB(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield users_db_1.DB.createDBConnection();
        try {
            const stmt = yield db.prepare("INSERT INTO USERS (email, password, display_name, photo_url) VALUES (?1, ?2, ?3, ?4)");
            yield stmt.bind({
                1: user.email,
                2: user.password,
                3: user.display_name,
                4: user.photo_url,
            });
            const operationResult = yield stmt.run();
            yield stmt.finalize();
            return operationResult; // Optionally return the result of the operation
        }
        catch (error) {
            console.error("Error inserting user:", error);
            throw error;
        }
        finally {
            yield db.close();
        }
    });
}
function GetAllUsersFromDB() {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield users_db_1.DB.createDBConnection();
        try {
            const stmt = yield db.prepare("SELECT email, password, display_name, photo_url FROM USERS");
            const result = yield stmt.all();
            yield stmt.finalize();
            return result;
        }
        catch (error) {
            console.error("Error retrieving users:", error);
            throw error;
        }
        finally {
            yield db.close();
        }
    });
}
function GetUserByEmailFromDB(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield users_db_1.DB.createDBConnection();
        try {
            const stmt = yield db.prepare("SELECT email, password, display_name, photo_url FROM USERS WHERE email = ?");
            yield stmt.bind([email]);
            const result = yield stmt.get();
            yield stmt.finalize();
            return result || null;
        }
        catch (error) {
            console.error("Error retrieving user by email:", error);
            throw error;
        }
        finally {
            yield db.close();
        }
    });
}
// GOOGLE
router.get("/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport_1.default.authenticate("google", { failureRedirect: "/login" }), (req, res) => {
    res.redirect("http://localhost:5173/");
});
// GITHUB
router.get("/github", passport_1.default.authenticate("github"));
router.get("/github/callback", passport_1.default.authenticate("github", { failureRedirect: "/login" }), (req, res) => {
    res.redirect("http://localhost:5173/");
});
router.get("/profile", (req, res) => {
    if (req.isAuthenticated() && req.user) {
        res.json(req.user);
    }
});
router.get("/", (req, res) => {
    res.send("User Home Page");
});
exports.default = router;
