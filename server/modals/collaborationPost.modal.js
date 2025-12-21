import mongoose from "mongoose";

const collaborationPostSchema = new mongoose.Schema(
  {
    startup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Startup",
      required: false,
      index: true,
    },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },

    roleNeeded: {
      type: String,
      enum: ["developer", "designer", "marketer", "co-founder", "other"],
      required: true,
      index: true,
    },

    skillsRequired: {
      type: [String],
      default: [],
    },

    commitment: {
      type: String,
      enum: ["full-time", "part-time", "freelance"],
      required: true,
    },

    location: {
      type: String,
      default: "remote",
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    applications: [
      {
        applicant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        message: { type: String, maxlength: 2000 },
        status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// text indexes for search
collaborationPostSchema.index({ title: "text", description: "text", skillsRequired: "text" });

const CollaborationPost = mongoose.model("CollaborationPost", collaborationPostSchema);

export default CollaborationPost;
