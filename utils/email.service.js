import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "dropbyerrands@gmail.com",
        pass: "huuwilewmupvmcbt"
    }
});

export const sendOrderConfirmationEmail = async (customerEmail) => {
    const mailOptions = {
        from: {
            name: "Dropby Errands",
            address: "support@dropbyerrands.com"
        },
        to: customerEmail,
        subject: "Order Received",
        html: `
            <h1 style="color: #36ba9b;">Your order has been received and is being processed</h1>
            <p style="color: #555;">Thank you for shopping with us</p>
            <p style="color: #555;">Regards <strong>Dropby Errands</strong></p>
        `
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                reject(error);
            } else {
                console.log(`Email Sent successfully. Info ${JSON.stringify(info)}`);
                resolve(info);
            }
        });
    });
};

