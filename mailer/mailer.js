const nodemailer = require('nodemailer');

const mailConfig = {
    host: 'smtp.ethereal.email.',
    port: 587,
    auth: {
        user: 'jairo.kirlin@ethereal.email',
        pass: 'KMjMHvAz2pBx5aHr8s'
    }
};

module.exports = nodemailer.createTransport(mailConfig);
