import express from "express";
import { getPendingStartups, verifyStartup, rejectStartup } from "../controllers/admin.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/startups/pending", protectRoute, requireRole("admin"), getPendingStartups);
router.put("/startups/:startupId/verify", protectRoute, requireRole("admin"), verifyStartup);
router.put("/startups/:startupId/reject", protectRoute, requireRole("admin"), rejectStartup);

export default router;
