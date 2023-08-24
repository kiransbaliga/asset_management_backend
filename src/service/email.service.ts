import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  secureConnection: true,
  port: 587,
  tls: {
    ciphers: "SSLv3",
  },
  auth: {
    user: "kiransbaliga@gmail.com",
    pass: process.env.EMAIL_PASSWORD,
  },
});



// var mailOptions = {
//   from: "ppsukunan@outlook.com>",
//   to: "kiransbaliga@gmail.com",
//   subject: "Hello ",
//   text: "Hello world ",
// };

// transporter.sendMail(mailOptions, function (error, info) {
//   if (error) {
//     return console.log(error);
//   }

//   console.log("Message sent: " + info.response);
// });
