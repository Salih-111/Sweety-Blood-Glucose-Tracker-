import express from "express";

import {
  getDailyReport,
  getMonthToDateReport,
  getPreviousMonthReport,
} from "../controllers/reportsController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// All report routes require authentication
router.use(authMiddleware);

router.get("/daily", getDailyReport);
router.get("/month-to-date", getMonthToDateReport);
router.get("/previous-month", getPreviousMonthReport);

export default router;