import Startup from "../modals/startup.modal.js";

export const getPendingStartups = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const q = { isVerified: false, isActive: true };
    const total = await Startup.countDocuments(q);
    const results = await Startup.find(q).skip((page - 1) * limit).limit(limit).populate("founder", "name email");
    return res.json({ total, page, limit, results });
  } catch (error) {
    console.error("getPendingStartups error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const verifyStartup = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.startupId);
    if (!startup) return res.status(404).json({ message: "Startup not found" });
    startup.isVerified = true;
    await startup.save();
    return res.json({ message: "Startup verified", startup });
  } catch (error) {
    console.error("verifyStartup error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const rejectStartup = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.startupId);
    if (!startup) return res.status(404).json({ message: "Startup not found" });
    startup.isActive = false;
    startup.isVerified = false;
    await startup.save();
    return res.json({ message: "Startup rejected" });
  } catch (error) {
    console.error("rejectStartup error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
