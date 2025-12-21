import Startup from "../modals/startup.modal.js";

export const ensureOwnership = async (req, res, next) => {
  try {
    const startupId = req.params.startupId || req.params.id;
    if (!startupId) return res.status(400).json({ message: "startupId required" });
    const startup = await Startup.findById(startupId);
    if (!startup) return res.status(404).json({ message: "Startup not found" });
    // attach for handlers
    req.startup = startup;
    if (startup.founder.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden: Not the owner" });
    }
    next();
  } catch (error) {
    console.error("Ownership middleware error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
