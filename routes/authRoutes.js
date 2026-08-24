import express from "express";

import { loginController } from "../controllers/authController.js";
import { loginValidation } from "../middleware/validation.js";

// Create router for authentication routes
const router = express.Router();

// POST /api/v1/auth/login - Login endpoint
router.post("/login", loginValidation, loginController);

export default router;
