import Customer from "../models/customer.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register a new customer
export const register = async (req, res) => {
  try {
    const { first_name, last_name, phone, email, password } = req.body;

    // Check if customer already exists
    const customerExists = await Customer.findOne({ email });

    if (customerExists) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate slug
    const slug = `${first_name.toLowerCase()}-${last_name.toLowerCase()}`;

    // Create new customer
    const customer = new Customer({
      first_name,
      last_name,
      phone,
      email,
      password: hashedPassword,
      slug,
    });

    const newCustomer = await customer.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        _id: newCustomer._id,
        first_name: newCustomer.first_name,
        last_name: newCustomer.last_name,
        email: newCustomer.email,
        phone: newCustomer.phone,
        slug: newCustomer.slug,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred during registration",
      error: error.message,
    });
  }
};

// Login customer
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find customer
    const customer = await Customer.findOne({ email })
      .populate("orders")
      .exec();

    // Check if customer exists
    if (!customer) {
      return res.status(401).json({
        success: false,
        message: "Incorrect email",
      });
    }

    // Check if password is correct
    const validPassword = bcrypt.compareSync(password, customer.password);

    if (!validPassword) {
      return res.status(403).json({
        success: false,
        message: "Wrong password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        _id: customer._id,
        email: customer.email,
        first_name: customer.first_name,
        last_name: customer.last_name,
      },
      process.env.SECRET_KEY,
      { expiresIn: "3h" }
    );

    return res.status(200).json({
      status: 200,
      success: true,
      token: token,
      data: {
        _id: customer._id,
        first_name: customer.first_name,
        last_name: customer.last_name,
        email: customer.email,
        phone: customer.phone,
        orders: customer.orders,
      },
      message: "Successfully logged in",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during login",
      error: error.message,
    });
  }
};

// Get all customers
export const fetchAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find()
      .sort({ createdAt: -1 })
      .populate("orders")
      .exec();

    res.status(200).json({
      success: true,
      data: customers,
      message: "All customers retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving customers",
      error: error.message,
    });
  }
};

// Get customer by ID
export const fetchSingleCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id)
      .populate("orders")
      .exec();

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.status(200).json({
      success: true,
      data: customer,
      message: "Customer retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving customer",
      error: error.message,
    });
  }
};
