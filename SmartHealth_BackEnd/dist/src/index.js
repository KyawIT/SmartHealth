"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const cors_1 = __importDefault(require("cors"));
const email_1 = __importDefault(require("./routes/email"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const corsOptions = {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Allow cookies and authorization headers
};
app.use((0, cors_1.default)(corsOptions));
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use("/auth", auth_1.default);
app.use("/email", email_1.default);
app.use((0, cors_1.default)({ origin: "*" }));
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
