import Ticket from "../models/ticket.model.js";
import Customer from "../models/customer.model.js";

// Create a new ticket
export const createTicket = async (req, res) => {
  try {
    const { customer_id, email, meals, longitude, latitude } = req.body;

    // Check if customer exists
    const customerExists = await Customer.findById(customer_id);
    if (!customerExists) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // Validate meals array
    if (!Array.isArray(meals) || meals.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Meals must be a non-empty array",
      });
    }

    // Calculate total price
    const total_price = meals.reduce((sum, meal) => {
      return sum + meal.price * (meal.quantity || 1);
    }, 0);

    // Generate ticket ID
    const ticket_id = Ticket.generateTicketId();

    // Create new ticket
    const newTicket = new Ticket({
      ticket_id,
      customer: customer_id,
      email,
      meals,
      total_price,
      longitude,
      latitude,
    });

    await newTicket.save();

    // Add ticket to customer's orders
    await Customer.findByIdAndUpdate(customer_id, {
      $push: { tickets: newTicket._id },
    });

    res.status(201).json({
      success: true,
      message: "Ticket created successfully",
      data: newTicket,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the ticket",
      error: error.message,
    });
  }
};

// Get all tickets
export const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()

    res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching tickets",
      error: error.message,
    });
  }
};

// Backend function to fetch a single ticket by ID
// This would go in your ticket.controller.js file

export const fetchSingleTicket = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ticket ID format"
      });
    }

    const ticket = await Ticket.findById(id)
      .populate("customer", "first_name last_name email") // Populate customer details
      .exec();
    
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found"
      });
    }
    
    return res.status(200).json({
      success: true,
      data: ticket,
      message: "Ticket retrieved successfully"
    });
    
  } catch (error) {
    console.error("Error fetching ticket:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve ticket",
      error: error.message
    });
  }
};

// Get tickets by customer ID
export const getTicketsByCustomer = async (req, res) => {
  try {
    const { customer_id } = req.params;

    const tickets = await Ticket.find({ customer: customer_id })
      .sort({ createdAt: -1 })
      .exec();

    res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching customer tickets",
      error: error.message,
    });
  }
};

// Get ticket by ID
export const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findById(id)
      .populate("customer", "first_name last_name email")
      .exec();

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    res.status(200).json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the ticket",
      error: error.message,
    });
  }
};

// Update ticket status
export const updateTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "processing", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const updatedTicket = await Ticket.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedTicket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Ticket status updated successfully",
      data: updatedTicket,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the ticket",
      error: error.message,
    });
  }
};

// Delete ticket
export const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    await Customer.findByIdAndUpdate(ticket.customer, {
      $pull: { orders: id },
    });

    await Ticket.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Ticket deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the ticket",
      error: error.message,
    });
  }
};
