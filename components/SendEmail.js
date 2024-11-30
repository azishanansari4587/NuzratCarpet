import React from 'react'

const SendEmail = async({product}) => {
    const [rows] = await connection.query('SELECT email FROM subscribers WHERE is_verified = true');
    emailList = rows.map(row => row.email);
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_ADDRESS,
          pass: process.env.EMAIL_PASSWORD
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: emailList,
        subject: `New Product: ${product.name}`,
        text: `Check out our new product: ${product.description}`,
        // html: `
        // <h1>New Product Added</h1>
        // <p>${product.name}</p>
        // <p>${product.description}</p>
        // <p>${product.price}</p>
        // <p>${product.image}</p>`
    }; 

    await transporter.sendMail(mailOptions);

    console.log('Email sent successfully');
    await connection.end();
}

export default SendEmail