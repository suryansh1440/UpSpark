import express from "express";
import {
  sendFundingRequest,
  getMyFundingRequests,
  getFundingRequestById,
  withdrawFundingRequest,
} from "../controllers/investor.controller.js";
import {
  addToWatchlist,
  removeFromWatchlist,
  getWatchlist,
} from "../controllers/watchlist.controller.js";

import { protectRoute } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = express.Router();

/* ===============================
   FUNDING (INVESTOR)
================================ */

// send funding request to startup
router.post(
  "/funding/request",
  protectRoute,
  requireRole("investor"),
  sendFundingRequest
);

// get all funding requests sent by investor
router.get(
  "/funding",
  protectRoute,
  requireRole("investor"),
  getMyFundingRequests
);

// get single funding request
router.get(
  "/funding/:requestId",
  protectRoute,
  requireRole("investor"),
  getFundingRequestById
);

// withdraw funding request
router.put(
  "/funding/:requestId/withdraw",
  protectRoute,
  requireRole("investor"),
  withdrawFundingRequest
);

/* ===============================
   WATCHLIST
================================ */

router.post(
  "/watchlist/:startupId",
  protectRoute,
  requireRole("investor"),
  addToWatchlist
);

router.get(
  "/watchlist",
  protectRoute,
  requireRole("investor"),
  getWatchlist
);

router.delete(
  "/watchlist/:startupId",
  protectRoute,
  requireRole("investor"),
  removeFromWatchlist
);

export default router;
