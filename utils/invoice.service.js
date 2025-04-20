import nodemailer from "nodemailer";
import pug from "pug";
import path from "path";
import { fileURLToPath } from "url";
import { promises as fs } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "dropbyerrands@gmail.com",
    pass: "huuwilewmupvmcbt",
  },
});

export const sendOrderConfirmationEmail = async (customerEmail, order) => {
  // Compile the Pug template
  const templatePath = path.join(
    __dirname,
    "templates",
    "order-confirmation.pug"
  );
  const compiledFunction = pug.compileFile(templatePath);

  // Render the HTML
  const html = compiledFunction({
    order,
  });

  const mailOptions = {
    from: {
      name: "Dropby Errands",
      address: "support@dropbyerrands.com",
    },
    to: customerEmail,
    subject: "Order Confirmation",
    html: html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email Sent successfully. Info: ${JSON.stringify(info)}`);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export const sendInvoiceEmail = async (customerEmail, order) => {
  // Compile the Pug template
  const templatePath = path.join(__dirname, "templates", "invoice.pug");
  const compiledFunction = pug.compileFile(templatePath);

  // Render the HTML
  const html = compiledFunction({
    order,
  });

  const mailOptions = {
    from: {
      name: "Dropby Errands",
      address: "support@dropbyerrands.com",
    },
    to: customerEmail,
    subject: "Order Confirmation",
    html: html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email Sent successfully. Info: ${JSON.stringify(info)}`);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export const sendVerificationEmail = async (email, verificationCode) => {
  const mailOptions = {
    from: '"Impact Chemicals Limited" <impactlimited@gmail.com>',
    to: email,
    subject: "Verification Code for Your Account",
    html: `
      <h1>Welcome to Impact Chemicals Limited!</h1>
      <p>Your verification code is: <strong>${verificationCode}</strong></p>
      <p>Please use this code to verify your account.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully");
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};

export const sendResetEmailCode = async (email, verificationCode) => {
  const mailOptions = {
    from: '"Dropby Errands" <dropbyerrands@gmail.com>',
    to: email,
    subject: "Reset Code for Your Account",
    html: `
      <h1>Welcome to Dropby Errands!</h1>
      <p>Your reset code is: <strong>${verificationCode}</strong></p>
      <p>Please use this code to reset your email.</p>
    `,
  };

  try {
    const response = await transporter.sendMail(mailOptions);

    return response;

    // console.log('Verification email sent successfully');
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};

export const sendResetPhoneCode = async (email, verificationCode) => {
  const mailOptions = {
    from: '"Dropby Errands" <dropbyerrands@gmail.com>',
    to: email,
    subject: "Reset Code for Your Account",
    html: `
      <h1>Welcome to Dropby Errands!</h1>
      <p>Your reset code is: <strong>${verificationCode}</strong></p>
      <p>Please use this code to reset your phone number.</p>
    `,
  };

  try {
    const response = await transporter.sendMail(mailOptions);
    // console.log('Verification email sent successfully');
    return response;
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};

export const sendResetPasswordEmail = async (email, resetCode) => {
  const mailOptions = {
    from: '"Dropby Errands" <dropbyerrands@gmail.com>',
    to: email,
    subject: "Reset Code for Your Account",
    html: `
      <h1>Welcome to Dropby Errands!</h1>
      <p>Your reset code is: <strong>${resetCode}</strong></p>
      <p>Please use this code to reset your password.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully");
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};

// send carpet invoice email
export const sendCarpetInvoiceEmail = async (customerEmail, order) => {
  // Compile the Pug template
  const templatePath = path.join(__dirname, "templates", "carpet-invoice.pug");
  const compiledFunction = pug.compileFile(templatePath);

  // Render the HTML
  const html = compiledFunction({
    order,
  });

  const mailOptions = {
    from: {
      name: "Dropby Errands",
      address: "support@dropbyerrands.com",
    },
    to: customerEmail,
    subject: "Carpet Order Confirmation",
    html: html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email Sent successfully. Info: ${JSON.stringify(info)}`);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export const sendCarpetOrder = async (customerEmail, order) => {
  // Compile the Pug template
  const templatePath = path.join(
    __dirname,
    "templates",
    "carpet-confirmation.pug"
  );
  const compiledFunction = pug.compileFile(templatePath);

  // Render the HTML
  const html = compiledFunction({
    order,
  });

  const mailOptions = {
    from: {
      name: "Dropby Errands",
      address: "support@dropbyerrands.com",
    },
    to: customerEmail,
    subject: "Carpet Order Confirmation",
    html: html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email Sent successfully. Info: ${JSON.stringify(info)}`);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
