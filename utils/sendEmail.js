import nodemailer from 'nodemailer'

export const sendErrorEmail = async (subject, error) => {
    try {
        var transporter = nodemailer.createTransport({
            service: 'outlook',
            auth: {
              user: process.env.GMAIL_EMAIL,
              pass: process.env.GMAIL_PASSWORD
            }
          });

        await transporter.sendMail({
            from: process.env.USER,
            to: 'amarnath@wegile.com',
            subject: subject,
            text: `Error details: ${error}`,
        });
        console.log("sent email successfully")
    } catch (error) {
        console.log("Email not sent!");
        console.error(error);
        throw error; // Rethrow the error to handle it at the calling site
    }
};
  