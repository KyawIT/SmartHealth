import express from "express";
import dotenv from "dotenv";
import emailjs from '@emailjs/browser';

const app = express();
 

export  const sendEmail  = (e: any) => {
    emailjs
      .sendForm('service_ydrj1vc', 'template_430invf', e.target, {
        publicKey: 'JW63BOZ9p-2sBWImW',
      })
      .then(
        () => {
          console.log('SUCCESS!');
        },
        (error) => {
          console.log('FAILED...', error.text);
        },
      );
};
