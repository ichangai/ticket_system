import express from "express";
import {
  createTicket,
  getAllTickets,
  getTicketsByCustomer,
  getTicketById,
  updateTicketStatus,
  deleteTicket,
} from "../controllers/ticket.controller.js";

const router = express.Router();

// Ticket routes
router.post("/ticket", createTicket);
router.get("/tickets", getAllTickets);
router.get("/customer/:customer_id", getTicketsByCustomer);
router.get("/:id", getTicketById);

export default router;
