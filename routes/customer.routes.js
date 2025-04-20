import express from "express";
const router = express.Router();
import * as Customer from "../controllers/customer.controller.js";

router.post("/customer/signup", Customer.register);
router.post("/customer/signin", Customer.login);

export default router;