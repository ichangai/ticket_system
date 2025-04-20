import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Meal item schema (sub-document)
const MealItemSchema = new Schema({
  item_name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
});

// Ticket schema
const TicketSchema = new Schema(
  {
    ticket_id: {
      type: String,
      required: true,
      unique: true,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    meals: [MealItemSchema],
    total_price: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Generate unique ticket ID
TicketSchema.statics.generateTicketId = function () {
  // Format: TKT-YYYYMMDD-XXXX (where XXXX is a random 4-digit number)
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(1000 + Math.random() * 9000); // 4-digit random number

  return `TKT-${year}${month}${day}-${random}`;
};

const Ticket = mongoose.model("Ticket", TicketSchema);
export default Ticket;
