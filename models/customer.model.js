import mongoose from "mongoose";
const Schema = mongoose.Schema;
import bcrypt from "bcrypt";

const CustomerSchema = new Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    tickets: [
      {
        type: Schema.Types.ObjectId,
        ref: "Ticket",
      },
    ],
  },
  {
    timestamps: true,
  }
);

CustomerSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const Customer = mongoose.model("Customer", CustomerSchema);
export default Customer;
