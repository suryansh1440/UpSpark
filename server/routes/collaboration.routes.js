import express from "express";
import {
  createCollaborationPost,
  getAllCollaborationPosts,
  getCollaborationPost,
  getMyCollaborationPosts,
  getMyApplications,
  applyToPost,
  getApplicationsForPost,
  acceptApplication,
  rejectApplication,
  updateCollaborationPost,
  deleteCollaborationPost,
} from "../controllers/collaboration.controller.js";

import { protectRoute } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { ensurePostOwnership } from "../middleware/ownership.middleware.js";

const router = express.Router();

// Public
router.get("/", getAllCollaborationPosts);
// authenticated "mine" should be before :postId to avoid route conflicts
router.get("/mine", protectRoute, getMyCollaborationPosts);
router.get("/applications/mine", protectRoute, getMyApplications);
router.get("/:postId", getCollaborationPost);

// applications
router.post("/:postId/apply", protectRoute, requireRole("collaborator"), applyToPost);
router.get("/:postId/applications", protectRoute, ensurePostOwnership, getApplicationsForPost);
router.put("/:postId/applications/:appId/accept", protectRoute, ensurePostOwnership, acceptApplication);
router.put("/:postId/applications/:appId/reject", protectRoute, ensurePostOwnership, rejectApplication);

// Protected (authenticated users can create)
router.post("/", protectRoute, createCollaborationPost);
router.put("/:postId", protectRoute, ensurePostOwnership, updateCollaborationPost);
router.delete("/:postId", protectRoute, ensurePostOwnership, deleteCollaborationPost);

export default router;
