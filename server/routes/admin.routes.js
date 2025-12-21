import express from "express";
import {
	getAllUsers,
	blockUser,
	unblockUser,
	verifyUser,
	deleteUser,

	getPendingStartups,
	getAllStartupsAdmin,
	verifyStartup,
	rejectStartup,

	getAllFundingRequests,
	getFundingRequestById,
	cancelFundingRequest,

	getAllCollaborationPostsAdmin,
	disableCollaborationPost,
	deleteCollaborationPost,

	sendSystemNotification,
	getAdminStats,
} from "../controllers/admin.controller.js";

import { protectRoute } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = express.Router();

// All admin routes require admin role
router.use(protectRoute, requireRole("admin"));

/* USERS */
router.get("/users", getAllUsers);
router.put("/users/:userId/block", blockUser);
router.put("/users/:userId/unblock", unblockUser);
router.put("/users/:userId/verify", verifyUser);
router.delete("/users/:userId", deleteUser);

/* STARTUPS */
router.get("/startups", getAllStartupsAdmin);
router.get("/startups/pending", getPendingStartups);
router.put("/startups/:startupId/verify", verifyStartup);
router.put("/startups/:startupId/reject", rejectStartup);

/* FUNDING */
router.get("/funding", getAllFundingRequests);
router.get("/funding/:requestId", getFundingRequestById);
router.put("/funding/:requestId/cancel", cancelFundingRequest);

/* COLLABORATION */
router.get("/collaboration", getAllCollaborationPostsAdmin);
router.put("/collaboration/:postId/disable", disableCollaborationPost);
router.delete("/collaboration/:postId", deleteCollaborationPost);

/* NOTIFICATIONS */
router.post("/notifications", sendSystemNotification);

/* STATS */
router.get("/stats", getAdminStats);

export default router;
