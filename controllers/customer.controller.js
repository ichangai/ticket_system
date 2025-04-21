import Customer from "../models/customer.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// create an Customer
export const register = async (req, res) => {
  try {
    const { first_name, last_name, phone, email, address, company } = req.body;

    // check if customer exists in db
    const customerExists = await Customer.findOne({
      email,
    });

    if (!customerExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      // Generate the slug based on the name
      const slug = `${first_name.toLowerCase()}-${last_name.toLowerCase()}`;

      // Generate 6 random numeric code
      const verification_code = Math.floor(100000 + Math.random() * 900000);

      const customer = new Customer({
        first_name,
        last_name,
        phone,
        email,
        password: hashedPassword,
        slug,
        address,
        company,
        verification_code,
      });

      const newCustomer = await customer.save();

      res.status(201).json({
        success: true,
        message:
          "User created successfully. Please check your email for the verification code.",
        data: newCustomer,
      });

      // Send verification code via email
      const emailResponse = await sendVerificationEmail(
        email,
        verification_code
      );
      console.log(emailResponse);
    } else {
      res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred during registration",
      error: error.message,
    });
  }
};

// resend verification code
export const resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    const customer = await Customer.findOne({
      email: email,
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate 6 numeric random code
    const verification_code = Math.floor(100000 + Math.random() * 900000);

    customer.verification_code = verification_code;

    await customer.save();

    // Send verification code
    await sendVerificationEmail(email, verification_code);

    return res.status(200).json({
      success: true,
      message: "Verification code sent successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while sending the verification code",
      error: error.message,
    });
  }
};

// verify customer
export const verify = async (req, res) => {
  try {
    const { verification_code, _id } = req.body;

    const customer = await Customer.findById({
      _id: _id,
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (customer.verification_code === verification_code) {
      customer.verification_code = "0";
      customer.isVerified = true;
      await customer.save();

      // Generate a JWT token and return it to the client
      let token = jwt.sign(customer.toJSON(), `${process.env.SECRET_KEY}`, {
        expiresIn: 100800, // 3 hours
      });

      return res.status(200).json({
        success: true,
        message: "User verified successfully",
        data: token,
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid verification code",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

export const login = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      email: req.body.email,
    })
      .populate("orders")
      .exec();
    const headers = req.headers;

    // Check the User-Agent header
    const userAgent = headers["user-agent"];

    // Check if customer exists in the database
    if (!customer) {
      return res.status(401).json({
        success: false,
        message: "Incorrect email",
      });
    }

    // Check if password is correct
    const validPassword = bcrypt.compareSync(
      req.body.password,
      customer.password
    );
    if (!validPassword) {
      return res.status(403).json({
        success: false,
        message: "Wrong password",
      });
    }

    // Generate a JWT token and return it to the client
    let token = jwt.sign(customer.toJSON(), `${process.env.SECRET_KEY}`, {
      expiresIn: 10800, // 3 hours
    });
    return res.status(200).json({
      status: 200,
      success: true,
      token: token,
      data: customer,
      source: "Machine",
      message: "Successfully logged in",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Please clear cookies and try again",
      error: err,
    });
  }
};

// generate a reset code for customer, save it to the database and send it to the customer
export const forgotPasswordEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const customer = await Customer.findOne({
      email: email,
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Email not found",
      });
    }

    // Generate a reset code
    const reset_code = crypto.randomBytes(3).toString("hex");

    customer.reset_code = reset_code;

    await customer.save();

    const message = `Your reset code is ${reset_code}`;

    // Send reset code

    await sendResetPasswordEmail(customer.email, reset_code);

    return res.status(200).json({
      success: true,
      message: "Reset code sent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

export const verifyResetCode = async (req, res) => {
  try {
    const { email, reset_code } = req.body;

    console.log(email, reset_code);

    const customer = await Customer.findOne({
      email,
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "No such email or user",
      });
    }

    console.log(customer.reset_code, reset_code);

    if (customer.reset_code !== reset_code) {
      return res.status(400).json({
        success: false,
        message: "Invalid reset code",
      });
    }

    // If the code is valid, you might want to set a flag or update the reset_code
    // For example, set it to "verified" to indicate it's been used
    customer.reset_code = "verified";
    await customer.save();

    return res.status(200).json({
      success: true,
      message: "Reset code verified successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, new_password } = req.body;

    const customer = await Customer.findOne({
      email,
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if the reset_code is "verified" (as set in verifyResetCode)
    if (customer.reset_code !== "verified") {
      return res.status(400).json({
        success: false,
        message: "Reset code not verified",
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(new_password, salt);

    // Update the password and reset the reset_code
    customer.password = hashedPassword;
    customer.reset_code = "0"; // Reset to default value

    await customer.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

export const fetchCustomer = async (req, res) => {
  try {
    let foundCustomer = await Customer.findOne({
      _id: req.decoded._id,
    })
      .populate("orders")
      .exec();
    if (foundCustomer) {
      res.status(200).json({
        success: true,
        data: foundCustomer,
        message: "User found",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
      textMsg: "Sorry, no token found",
    });
  }
};

// // get all customers
export const fetchAllCustomers = async (req, res) => {
  try {
    let allCustomers = await Customer.find()
      .sort({
        createdAt: -1,
      })
      .populate("orders")
      .exec();
    res.status(200).json({
      success: true,
      data: allCustomers,
      message: "All customers found",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
      textMsg: "Sorry, no customers found",
    });
  }
};

// fetch single customer
export const fetchSingleCustomer = async (req, res) => {
  try {
    let foundCustomer = await Customer.findOne({
      _id: req.params.id,
    })
      .populate("orders")
      .exec();

    if (foundCustomer) {
      res.status(200).json({
        success: true,
        data: foundCustomer,
        message: "User found",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
      textMsg: "Sorry, no customer found",
    });
  }
};

// // update customer
export const updateCustomer = async (req, res) => {
  try {
    let foundCustomer = await Customer.findOne({
      _id: req.params.id,
    });

    if (foundCustomer) {
      // if it's email or phone, send code
      // if (req.body.email !== foundCustomer.email) {

      //     const emailExists = await Customer.findOne({
      //         email: req.body.email
      //     });

      //     if (emailExists) {
      //         return res.status(400).json({
      //             success: false,
      //             message: "Email already exists"
      //         });
      //     } else {
      //                 // Generate a reset code
      //         const reset_code = crypto.randomBytes(3).toString('hex');

      //         foundCustomer.reset_code = reset_code;

      //         await foundCustomer.save();

      //         const emailResponse = await sendResetEmailCode(foundCustomer.email, foundCustomer.reset_code);
      //         console.log(emailResponse)
      //         // check if the email exists. If it does return an error

      //         // check if the email was sent successfully
      //         if (emailResponse) {
      //             res.status(200).json({
      //                 success: true,
      //                 message: "Reset code sent successfully"
      //             });
      //         } else {
      //             res.status(500).json({
      //                 success: false,
      //                 message: "Error sending reset code. Please try again"
      //             });
      //         }
      //     }

      // } else if (req.body.phone !== foundCustomer.phone) {

      //     // check if the phone exists. If it does return an error

      //     const phoneExists = await Customer.findOne({
      //         phone: req.body.phone
      //     });

      //     if (phoneExists) {
      //         return res.status(400).json({
      //             success: false,
      //             message: "Phone already exists"
      //         });
      //     } else {
      //         // Generate a reset code
      //         const reset_code = crypto.randomBytes(3).toString('hex');

      //          foundCustomer.reset_code = reset_code;

      //         await foundCustomer.save();

      //         const phoneResponse = await sendResetPhoneCode(foundCustomer.email, foundCustomer.reset_code);

      //         // check if the phone was sent successfully
      //         if (phoneResponse) {
      //             res.status(200).json({
      //                 success: true,
      //                 message: "Reset code sent successfully"
      //             });
      //         } else {
      //             res.status(500).json({
      //                 success: false,
      //                 message: "Error sending reset code. Please try again"
      //             });
      //         }
      //     }
      // } else {
      if (req.body.first_name) foundCustomer.first_name = req.body.first_name;
      if (req.body.last_name) foundCustomer.last_name = req.body.last_name;
      if (req.body.address.location)
        foundCustomer.address.location = req.body.address.location;
      if (req.body.address.room_no)
        foundCustomer.address.room_no = req.body.address.room_no;
      if (req.body.address.building)
        foundCustomer.address.building = req.body.address.building;
      if (req.body.address.building)
        foundCustomer.address.building = req.body.address.building;
      if (req.body.address.long)
        foundCustomer.address.long = req.body.address.long;
      if (req.body.address.lat)
        foundCustomer.address.lat = req.body.address.lat;
      if (req.body.phone) foundCustomer.phone = req.body.phone;
      if (req.body.email) foundCustomer.email = req.body.email;
      // password
      if (req.body.password) {
        // firstly, do a check to see if current password is correct
        const validPassword = bcrypt.compareSync(
          req.body.currentPassword,
          foundCustomer.password
        );

        if (!validPassword) {
          return res.status(401).json({
            success: false,
            message: "Current password is incorrect",
          });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        foundCustomer.password = hashedPassword;
      }

      await foundCustomer.save();

      res.status(201).json({
        status: true,
        message: "Successfully updated customer",
        data: foundCustomer,
      });
      // }
    } else {
      res.status(404).json({
        status: false,
        message: "User not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// delete customer
export const remove = async (req, res) => {
  try {
    let foundCustomer = await Customer.findOne({
      _id: req.params.id,
    });

    if (foundCustomer) {
      await Customer.deleteOne({
        _id: req.params.id,
      });

      res.status(200).json({
        success: true,
        message: "Customer deleted successfully",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
