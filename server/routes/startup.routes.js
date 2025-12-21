import express from "express";
import multer from "multer";
import {
  createStartup,
  getStartups,
  getStartup,
  getMyStartups,
  updateStartup,
  deleteStartup,
  uploadPitchDeck,
  uploadDemoVideo,
  getTeam,
  addTeamMember,
  removeTeamMember,
  searchStartups,
  trendingStartups,
} from "../controllers/startup.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { ensureOwnership } from "../middleware/ownership.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = express.Router();

// use memory storage — we'll upload to Cloudinary in controller
const upload = multer({ storage: multer.memoryStorage() });

// public
router.get("/", getStartups);
router.get("/search", searchStartups);
router.get("/trending", trendingStartups);
// protected (place before param routes)
router.get('/mine', protectRoute, getMyStartups);
router.get("/:startupId", getStartup);

// protected founder routes
router.post("/", protectRoute, requireRole("founder"), createStartup);
router.put("/:startupId", protectRoute, ensureOwnership, updateStartup);
router.delete("/:startupId", protectRoute, deleteStartup);

router.post(
  "/:startupId/pitch-deck",
  protectRoute,
  upload.single("file"),
  uploadPitchDeck
);

router.post(
  "/:startupId/demo-video",
  protectRoute,
  upload.single("file"),
  uploadDemoVideo
);

router.get("/:startupId/team", getTeam);
router.post("/:startupId/team", protectRoute, ensureOwnership, addTeamMember);
router.delete("/:startupId/team/:userId", protectRoute, removeTeamMember);

export default router;
