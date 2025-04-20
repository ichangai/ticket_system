// app.js
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
// Import configurations

// Import routes
import customerRoutes from "./routes/customer.routes.js";
import ticketRoutes from "./routes/ticket.routes.js";

export const app = express();

// Middleware setup
app.use(express.json());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: false }));


// CORS setup
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:8081",
];

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not " +
          "allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// Enable trust proxy
app.enable("trust proxy");

// Routes
app.use("/api", customerRoutes);
app.use("/api", ticketRoutes);


// Home route

// API root route
app.get("/api", (req, res) => {
  res.send(
    "Ticketing System API is running. Please use the correct endpoint to access the API"
  );
});
