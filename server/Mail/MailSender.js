const nodemailer = require("nodemailer");
require("dotenv").config();
const path = require("path");

const mailsender = async (email, title, body, pdfPath) => {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        let mailOptions = {
            from: "Gautam Solar Private Limited ",
            to: email,
            subject: title,
            html: body,
            attachments:pdfPath?[{
                filename:"proposal Pdf",
                path:pdfPath,
                contentType:"application/pdf"
            }]:[]
        };
        console.log(mailOptions);

        let info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", info);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

module.exports = mailsender;
