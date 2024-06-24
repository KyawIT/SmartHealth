"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const nodemailer_1 = __importDefault(require("nodemailer"));
dotenv_1.default.config();
const myEmail = process.env.EMAIL;
const password = process.env.GMAIL_APP_PASSWORD;
const emailRouter = express_1.default.Router();
emailRouter.get("/email", (req, res) => {
    console.log("Hello World");
});
emailRouter.post("/sendEmail", (req, res) => {
    let content = req.body;
    sendEmail(content.name, content.email, content.subject, content.message);
});
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: myEmail,
        pass: password
    }
});
function sendEmail(name, email, subject, text) {
    let message = {
        from: email,
        to: myEmail,
        subject: subject,
        text: "From: " + email + '\n' + '\n' +
            "Subject: " + subject + '\n' + '\n' +
            "Customer Name: " + name + '\n' + '\n' +
            "Message: " + '\n' + '\n' + text
    };
    transporter.sendMail(message);
}
exports.default = emailRouter;
