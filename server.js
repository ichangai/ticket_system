// import { connect } from "http2";
import { app } from "./app.js";
import dotenv from 'dotenv';
dotenv.config();
import connectDB from "./utils/connectDB.js";
// require("./models/database");

// create server
const port = process.env.PORT || 6500;

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${port}`);
  connectDB();
});

