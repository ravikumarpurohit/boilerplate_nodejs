const nodemailer = require('nodemailer');

async function mailer(req_email, _id){
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'divyeshborkhatariya1@gmail.com',
        pass: 'idyyhozitogmxank'
      }
    });
    
    const mailOptions = {
      from: 'divyeshborkhatariya1@gmail.com',
      to: req_email,
      subject: 'Verify your account',
      text: 'Verify your account - http://localhost:3005/api/v1/user/email-verify/'+_id
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        return console.log("error in sending a mail",error);
    } else {
           console.log('Email sent: ',mailOptions);
         }
    });
    

}  catch (error) {
  console.log(error)
}
};

module.exports = mailer;
