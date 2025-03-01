import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
export const sendEmail = async({
  to = [],
  cc = [],
  bcc = [],
  subject = "Route",
  text = "",
  html = "",
  attachments = [],
} = {}) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", 
    port: 587,
    secure: false, 
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
    try {
      const info = await transporter.sendMail({
        from: `"Route Academy" <${process.env.EMAIL}>`, 
        to,
        cc,
        bcc,
        subject,
        text,
        html,
        attachments,
      });
  
      console.log("Message sent: %s", info.messageId);
    } catch (error) {
      console.error("Error sending email:", error);
    }
};
