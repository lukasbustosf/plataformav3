const sendEmail = async (to, subject, text, html) => {
  console.log(`
--- Sending Email ---
To: ${to}
Subject: ${subject}
Text: ${text}
HTML: ${html}
---------------------
`);
  // In a real application, you would integrate with an email sending service here
  // e.g., using Nodemailer, SendGrid, Mailgun, etc.
  // Example with Nodemailer (requires setup):
  /*
  const nodemailer = require('nodemailer');
  let transporter = nodemailer.createTransport({
    host: "smtp.example.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "your_email@example.com",
      pass: "your_password",
    },
  });

  let info = await transporter.sendMail({
    from: '"EDU21" <no-reply@edu21.com>',
    to: to,
    subject: subject,
    text: text,
    html: html,
  });

  console.log("Message sent: %s", info.messageId);
  */
};

module.exports = { sendEmail };
