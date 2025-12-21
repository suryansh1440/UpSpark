import Startup from "../modals/startup.modal.js";
import User from "../modals/user.modal.js";
import mongoose from "mongoose";
import path from "path";
import cloudinary from "../lib/cloudinary.js";
import streamifier from "streamifier";

// 1. Create Startup (Founder)
export const createStartup = async (req, res) => {
  try {
    const payload = { ...req.body, founder: req.user._id };
    const startup = await Startup.create(payload);
    return res.status(201).json(startup);
  } catch (error) {
    console.error("createStartup error:", error);
    return res.status(400).json({ message: error.message });
  }
};

// 2. Get all startups with filters
export const getStartups = async (req, res) => {
  try {
    const {
      industry,
      stage,
      location,
      minFunding,
      maxFunding,
      search,
      sort,
      page = 1,
      limit = 20,
    } = req.query;

    const q = { isActive: true };
    if (industry) q.industry = industry;
    if (stage) q.stage = stage;
    if (location) q.location = location;
    if (minFunding || maxFunding) q.fundingRequired = {};
    if (minFunding) q.fundingRequired.$gte = Number(minFunding);
    if (maxFunding) q.fundingRequired.$lte = Number(maxFunding);
    if (search) {
      const re = new RegExp(search, "i");
      q.$or = [
        { name: re },
        { tagline: re },
        { industry: re },
        { problem: re },
        { solution: re },
      ];
    }

    let cursor = Startup.find(q).populate("founder", "name avatar email");

    if (sort === "trending") {
      cursor = cursor.sort({ "traction.users": -1, createdAt: -1 });
    } else if (sort === "recent") {
      cursor = cursor.sort({ createdAt: -1 });
    }

    const total = await Startup.countDocuments(q);
    const results = await cursor.skip((page - 1) * limit).limit(Number(limit));
    return res.json({ total, page: Number(page), limit: Number(limit), results });
  } catch (error) {
    console.error("getStartups error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// get startups for current founder
export const getMyStartups = async (req, res) => {
  try {
    const q = { founder: req.user._id };
    const results = await Startup.find(q).sort({ createdAt: -1 });
    return res.json({ total: results.length, results });
  } catch (error) {
    console.error("getMyStartups error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// 3. Get single startup
export const getStartup = async (req, res) => {
  try {
    const { startupId } = req.params;
    if (!mongoose.isValidObjectId(startupId)) return res.status(400).json({ message: "Invalid id" });
    const startup = await Startup.findById(startupId).populate("founder", "name avatar email").populate("teamMembers", "name email avatar");
    if (!startup) return res.status(404).json({ message: "Startup not found" });
    return res.json(startup);
  } catch (error) {
    console.error("getStartup error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// 4. Update startup (owner)
export const updateStartup = async (req, res) => {
  try {
    const startup = req.startup || (await Startup.findById(req.params.startupId));
    if (!startup) return res.status(404).json({ message: "Startup not found" });
    const allowed = [
      "name",
      "tagline",
      "logo",
      "industry",
      "stage",
      "location",
      "website",
      "problem",
      "solution",
      "businessModel",
      "targetMarket",
      "traction",
      "fundingRequired",
      "equityOffered",
    ];
    allowed.forEach((k) => {
      if (req.body[k] !== undefined) startup[k] = req.body[k];
    });
    await startup.save();
    return res.json(startup);
  } catch (error) {
    console.error("updateStartup error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// 5. Delete startup (owner or admin)
export const deleteStartup = async (req, res) => {
  try {
    const startupId = req.params.startupId;
    const startup = await Startup.findById(startupId);
    if (!startup) return res.status(404).json({ message: "Startup not found" });
    // if admin or owner
    if (req.user.roles.includes("admin") || startup.founder.toString() === req.user._id.toString()) {
      await startup.deleteOne();
      return res.json({ message: "Startup deleted" });
    }
    return res.status(403).json({ message: "Forbidden" });
  } catch (error) {
    console.error("deleteStartup error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// 6. Upload pitch deck
export const uploadPitchDeck = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const startup = await Startup.findById(req.params.startupId);
    if (!startup) return res.status(404).json({ message: "Startup not found" });
    // ownership check
    if (startup.founder.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Forbidden" });

    // upload buffer to cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const upload_stream = cloudinary.uploader.upload_stream(
        { folder: "pitch_decks", resource_type: "auto" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(upload_stream);
    });

    startup.pitchDeckUrl = uploadResult.secure_url;
    await startup.save();
    return res.json({ message: "Uploaded", pitchDeckUrl: uploadResult.secure_url });
  } catch (error) {
    console.error("uploadPitchDeck error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// 7. Upload demo video
export const uploadDemoVideo = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const startup = await Startup.findById(req.params.startupId);
    if (!startup) return res.status(404).json({ message: "Startup not found" });
    if (startup.founder.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Forbidden" });

    const uploadResult = await new Promise((resolve, reject) => {
      const upload_stream = cloudinary.uploader.upload_stream(
        { folder: "demo_videos", resource_type: "video" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(upload_stream);
    });

    startup.demoVideoUrl = uploadResult.secure_url;
    await startup.save();
    return res.json({ message: "Uploaded", demoVideoUrl: uploadResult.secure_url });
  } catch (error) {
    console.error("uploadDemoVideo error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// 8. Get team
export const getTeam = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.startupId).populate("teamMembers", "name email avatar");
    if (!startup) return res.status(404).json({ message: "Startup not found" });
    return res.json({ team: startup.teamMembers });
  } catch (error) {
    console.error("getTeam error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// 9. Add team member
export const addTeamMember = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!mongoose.isValidObjectId(userId)) return res.status(400).json({ message: "Invalid userId" });
    const startup = await Startup.findById(req.params.startupId);
    if (!startup) return res.status(404).json({ message: "Startup not found" });
    if (startup.founder.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Forbidden" });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (startup.teamMembers.includes(userId)) return res.status(400).json({ message: "Already a team member" });
    startup.teamMembers.push(userId);
    await startup.save();
    return res.json({ message: "Team member added", team: startup.teamMembers });
  } catch (error) {
    console.error("addTeamMember error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// 10. Remove team member
export const removeTeamMember = async (req, res) => {
  try {
    const { userId } = req.params;
    const startup = await Startup.findById(req.params.startupId);
    if (!startup) return res.status(404).json({ message: "Startup not found" });
    if (startup.founder.toString() !== req.user._id.toString() && !req.user.roles.includes("admin")) return res.status(403).json({ message: "Forbidden" });
    startup.teamMembers = startup.teamMembers.filter((m) => m.toString() !== userId);
    await startup.save();
    return res.json({ message: "Team member removed", team: startup.teamMembers });
  } catch (error) {
    console.error("removeTeamMember error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// 11. Search startups (optimized endpoint)
export const searchStartups = async (req, res) => {
  try {
    const q = req.query.q || "";
    const re = new RegExp(q.trim(), "i");
    const results = await Startup.find({
      isActive: true,
      $or: [{ name: re }, { tagline: re }, { problem: re }, { solution: re }, { industry: re }],
    })
      .limit(50)
      .populate("founder", "name");
    return res.json(results);
  } catch (error) {
    console.error("searchStartups error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// 12. Trending / featured
export const trendingStartups = async (req, res) => {
  try {
    const results = await Startup.find({ isActive: true, isVerified: true })
      .sort({ "traction.users": -1, createdAt: -1 })
      .limit(10)
      .populate("founder", "name avatar");
    return res.json(results);
  } catch (error) {
    console.error("trendingStartups error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};