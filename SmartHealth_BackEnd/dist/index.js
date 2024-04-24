"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("./user");
const http_status_codes_1 = require("http-status-codes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
var nodemailer = require('nodemailer');
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.get("/users", (req, res) => {
    res.status(http_status_codes_1.StatusCodes.OK).json(user_1.users);
});
app.post("/email", (req, res) => {
    let config = {
        service: 'gmail',
        auth: {
            user: "smarthealthorganisation@gmail.com", // your email address
            pass: "wltflmxxauhushnl" // your password
        }
    };
    let transporter = nodemailer.createTransport(config);
    let message = {
        from: 'smarthealthorganisation@gmail.com', // sender address
        to: 'mladenovicnikola066@gmail.com', // list of receivers
        subject: 'Welcome to ABC Website!', // Subject line
        html: "<b>Hello world?</b>"
    };
    transporter.sendMail(message).then((info) => {
        return res.status(201).json({
            msg: "Email sent",
            info: info.messageId,
            preview: nodemailer.getTestMessageUrl(info)
        });
    }).catch((err) => {
        return res.status(500).json({ msg: err });
    });
});
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    const user = user_1.users.find((u) => u.email === email);
    if (!user) {
        res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send("User not found");
        return;
    }
    const accToken = jsonwebtoken_1.default.sign(user, "TEST");
    res.status(http_status_codes_1.StatusCodes.OK).json(accToken);
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
