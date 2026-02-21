const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1) Create a transporter
    // For production, use a real service like SendGrid, Gmail, or your own SMTP
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'Gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    // 2) Define the email options
    const mailOptions = {
        from: `Vagwiin Support <${process.env.EMAIL_FROM || 'support@vagwiin.com'}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html
    };

    // 3) Actually send the email
    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully to:', options.email);
    } catch (error) {
        console.error('Email sending failed:', error);
        // We don't want to crash the app if email fails
    }
};

module.exports = sendEmail;
