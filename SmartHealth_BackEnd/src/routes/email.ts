import express from "express";
import dotenv from "dotenv";
import nodemailer from 'nodemailer';
import { log } from "console";
dotenv.config();

const myEmail: string = process.env.EMAIL as string;
const password: string = process.env.GMAIL_APP_PASSWORD as string;

const emailRouter = express.Router();
emailRouter.get("/email",(req,res) =>{
    console.log("Hello World");
})

emailRouter.post("/sendEmail",(req,res)=>{
    let content: {name:string, email:string, subject:string, message:string} = req.body;
    console.log(content);
    
    sendEmail(content.name,content.email,content.subject, content.message);
})

const transporter = nodemailer.createTransport({
   service: 'gmail',
   auth:{
    user: myEmail,
    pass: password
   }

})

function sendEmail(name:string, email:string, subject:string,  text: string){
    let message = {
        from: email,
        to: myEmail,
        subject: subject,
        html:"From: " + email + '\n' + "Message: " + text
    };

    transporter.sendMail(message);
}

export default emailRouter;