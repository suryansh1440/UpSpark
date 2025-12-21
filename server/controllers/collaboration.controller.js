import CollaborationPost from "../modals/collaborationPost.modal.js";
import Startup from "../modals/startup.modal.js";
import mongoose from "mongoose";
import Notification from '../modals/notification.modal.js'

// 1. Create Collaboration Post (founder only, must own startup)
export const createCollaborationPost = async (req, res) => {
  try {
    const {
      startup,
      title,
      description,
      roleNeeded,
      skillsRequired = [],
      commitment,
      location,
    } = req.body;
    // normalize startup: treat empty string / whitespace as not provided
    const startupId = startup && String(startup).trim() ? String(startup).trim() : undefined;

    if (startupId) {
      if (!mongoose.isValidObjectId(startupId)) return res.status(400).json({ message: "Invalid startup id" });
      const foundStartup = await Startup.findById(startupId);
      if (!foundStartup) return res.status(404).json({ message: "Startup not found" });
      if (foundStartup.founder.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Forbidden: Not the owner of the startup" });
    }

    const post = await CollaborationPost.create({
      ...(startupId ? { startup: startupId } : {}),
      postedBy: req.user._id,
      title,
      description,
      roleNeeded,
      skillsRequired,
      commitment,
      location,
    });
    return res.status(201).json(post);
  } catch (error) {
    console.error("createCollaborationPost error:", error);
    return res.status(400).json({ message: error.message });
  }
};

// 2. List + filter collaboration posts (public)
export const getAllCollaborationPosts = async (req, res) => {
  try {
    const { roleNeeded, skills, search, page = 1, limit = 20, sort } = req.query;
    const q = { isActive: true };
    if (roleNeeded) q.roleNeeded = roleNeeded;
    if (skills) q.skillsRequired = { $in: Array.isArray(skills) ? skills : skills.split(",") };
    if (search) {
      q.$text = { $search: search };
    }

    let cursor = CollaborationPost.find(q).populate("postedBy", "name avatar email").populate("startup", "name tagline");

    if (sort === "recent") cursor = cursor.sort({ createdAt: -1 });
    else cursor = cursor.sort({ createdAt: -1 });

    const total = await CollaborationPost.countDocuments(q);
    const results = await cursor.skip((page - 1) * limit).limit(Number(limit));
    return res.json({ total, page: Number(page), limit: Number(limit), results });
  } catch (error) {
    console.error("getAllCollaborationPosts error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get posts created by current user
export const getMyCollaborationPosts = async (req, res) => {
  try {
    const q = { postedBy: req.user._id };
    const results = await CollaborationPost.find(q).sort({ createdAt: -1 }).populate("startup", "name");
    return res.json({ total: results.length, results });
  } catch (error) {
    console.error("getMyCollaborationPosts error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get applications made by current user across posts
export const getMyApplications = async (req, res) => {
  try {
    const userId = req.user._id;
    // find posts where user has applied
    const posts = await CollaborationPost.find({ 'applications.applicant': userId }).populate('postedBy', 'name avatar email').populate('startup', 'name');
    // map to compact application list
    const results = [];
    posts.forEach((post) => {
      post.applications.forEach((app) => {
        if (String(app.applicant) === String(userId)) {
          results.push({
            postId: post._id,
            postTitle: post.title,
            startup: post.startup || null,
            postedBy: post.postedBy,
            message: app.message,
            status: app.status,
            applicationId: app._id,
            createdAt: app.createdAt || post.createdAt,
          });
        }
      });
    });
    return res.json({ total: results.length, results });
  } catch (error) {
    console.error('getMyApplications error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// 3. Get single post
export const getCollaborationPost = async (req, res) => {
  try {
    const { postId } = req.params;
    if (!mongoose.isValidObjectId(postId)) return res.status(400).json({ message: "Invalid id" });
    const post = await CollaborationPost.findById(postId).populate("postedBy", "name avatar email").populate("startup", "name tagline");
    if (!post) return res.status(404).json({ message: "Post not found" });
    return res.json(post);
  } catch (error) {
    console.error("getCollaborationPost error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Apply to a post (collaborator only)
export const applyToPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { message } = req.body;
    if (!mongoose.isValidObjectId(postId)) return res.status(400).json({ message: "Invalid id" });
    const post = await CollaborationPost.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });
    // prevent the poster applying to own post
    if (post.postedBy.toString() === req.user._id.toString()) return res.status(400).json({ message: "Cannot apply to your own post" });
    // prevent duplicate application
    const already = post.applications.some((a) => a.applicant.toString() === req.user._id.toString());
    if (already) return res.status(400).json({ message: "Already applied" });
    const app = { applicant: req.user._id, message };
    post.applications.push(app);
    await post.save();
    // return the newly created application (last element)
    const created = post.applications[post.applications.length - 1];
    // notify post owner
    try {
      await Notification.create({
        user: post.postedBy,
        title: 'New Collaboration Application',
        message: 'Someone applied to your collaboration post.',
        type: 'collaboration',
        link: '/dashboard/collaboration',
      })
    } catch (e) {
      console.error('failed to create notification for collaboration application:', e)
    }
    return res.status(201).json(created);
  } catch (error) {
    console.error("applyToPost error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get applications for a post (owner only)
export const getApplicationsForPost = async (req, res) => {
  try {
    const { postId } = req.params;
    if (!mongoose.isValidObjectId(postId)) return res.status(400).json({ message: "Invalid id" });
    const post = await CollaborationPost.findById(postId).populate("applications.applicant", "name email avatar");
    if (!post) return res.status(404).json({ message: "Post not found" });
    return res.json({ total: post.applications.length, applications: post.applications });
  } catch (error) {
    console.error("getApplicationsForPost error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Accept an application (owner only)
export const acceptApplication = async (req, res) => {
  try {
    const { postId, appId } = req.params;
    if (!mongoose.isValidObjectId(postId) || !mongoose.isValidObjectId(appId)) return res.status(400).json({ message: "Invalid id" });
    const post = await CollaborationPost.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });
    const app = post.applications.id(appId);
    if (!app) return res.status(404).json({ message: "Application not found" });
    app.status = 'accepted';
    await post.save();
    // populate applicant before returning
    const populated = await CollaborationPost.findById(postId).select('applications').populate('applications.applicant', 'name email avatar');
    const updatedApp = populated.applications.id(appId);
    // notify applicant
    try {
      await Notification.create({
        user: updatedApp.applicant._id || updatedApp.applicant,
        title: 'Application Accepted 🎉',
        message: 'Your collaboration application was accepted.',
        type: 'collaboration',
        link: '/dashboard/collaboration',
      })
    } catch (e) {
      console.error('failed to create notification for accepted application:', e)
    }
    return res.json(updatedApp);
  } catch (error) {
    console.error("acceptApplication error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Reject an application (owner only)
export const rejectApplication = async (req, res) => {
  try {
    const { postId, appId } = req.params;
    if (!mongoose.isValidObjectId(postId) || !mongoose.isValidObjectId(appId)) return res.status(400).json({ message: "Invalid id" });
    const post = await CollaborationPost.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });
    const app = post.applications.id(appId);
    if (!app) return res.status(404).json({ message: "Application not found" });
    app.status = 'rejected';
    await post.save();
    const populated = await CollaborationPost.findById(postId).select('applications').populate('applications.applicant', 'name email avatar');
    const updatedApp = populated.applications.id(appId);
    // notify applicant
    try {
      await Notification.create({
        user: updatedApp.applicant._id || updatedApp.applicant,
        title: 'Application Rejected',
        message: 'Your collaboration application was not selected.',
        type: 'collaboration',
        link: '/dashboard/collaboration',
      })
    } catch (e) {
      console.error('failed to create notification for rejected application:', e)
    }
    return res.json(updatedApp);
  } catch (error) {
    console.error("rejectApplication error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// 4. Update post (owner or admin via middleware)
export const updateCollaborationPost = async (req, res) => {
  try {
    const post = req.collaborationPost || (await CollaborationPost.findById(req.params.postId));
    if (!post) return res.status(404).json({ message: "Post not found" });
    const allowed = ["title", "description", "roleNeeded", "skillsRequired", "commitment", "location", "isActive"];
    allowed.forEach((k) => {
      if (req.body[k] !== undefined) post[k] = req.body[k];
    });
    await post.save();
    return res.json(post);
  } catch (error) {
    console.error("updateCollaborationPost error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// 5. Delete post (owner or admin)
export const deleteCollaborationPost = async (req, res) => {
  try {
    const post = req.collaborationPost || (await CollaborationPost.findById(req.params.postId));
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (req.user.roles.includes("admin") || post.postedBy.toString() === req.user._id.toString()) {
      await post.deleteOne();
      return res.json({ message: "Post deleted" });
    }
    return res.status(403).json({ message: "Forbidden" });
  } catch (error) {
    console.error("deleteCollaborationPost error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
