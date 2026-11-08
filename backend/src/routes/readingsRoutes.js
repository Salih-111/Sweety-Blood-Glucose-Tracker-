import express from "express";

import {
  createReading,
  getReadings,
  getReading,
  updateReading,
  deleteReading,
} from "../controllers/readingsController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// All reading routes require authentication
router.use(authMiddleware);

router.post("/", createReading);
router.get("/", getReadings);
router.get("/:id", getReading);
router.put("/:id", updateReading);
router.delete("/:id", deleteReading);

export default router;