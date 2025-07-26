const nodemailer = require('nodemailer');
const config = require('../config/config');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: config.emailUser,
        pass: config.emailPassword,
    },
});

exports.sendVerificationEmail = async (to, code) => {
    try {
        const mailOptions = {
            from: `"Bitebox" <${config.emailUser}>`,
            to,
            subject: 'Your Email Verification Code',
            text: `Your verification code is: ${code}`,
            html: `<p>Your verification code is: <b>${code}</b></p>`,
        };
        await transporter.sendMail(mailOptions);
        console.log(`Verification email sent successfully to: ${to}`);
    } catch (error) {
        console.error('Email sending error:', error.message);
        throw error;
    }
};