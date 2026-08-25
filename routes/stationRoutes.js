import express from "express";

import {
  listStations,
  stationAnnouncements,
} from "../controllers/stationController.js";

import { createAnnouncementController } from "../controllers/announcementController.js";
import { requireAdmin } from "../middleware/middleware.auth.js";
import { announcementValidation } from "../middleware/validation.js";

const router = express.Router();

// GET /api/v1/stations
router.get("/", listStations);

// GET /api/v1/stations/:id/announcements
router.get("/:id/announcements", stationAnnouncements);

// POST /api/v1/stations/:id/announcements
// Admin only
router.post(
  "/:id/announcements",
  requireAdmin,
  announcementValidation,
  createAnnouncementController
);
export default router;
