import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
  getProfile,
  updateProfile
} from "../controllers/userController.js";

const router = express.Router();

router.use(protect);

router.get("/profile", getProfile);

router.put("/profile", updateProfile);

export default router;