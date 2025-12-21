import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 60,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // IMPORTANT: never return password by default
    },

    // user can have multiple roles
    roles: {
      type: [String],
      enum: ["founder", "investor", "collaborator", "admin"],
      default: ["founder"],
    },

    // currently active role (for dashboard switch)
    activeRole: {
      type: String,
      enum: ["founder", "investor", "collaborator", "admin"],
      default: "founder",
    },

    avatar: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      maxlength: 500,
    },

    location: {
      type: String,
    },

    linkedinUrl: {
      type: String,
    },

    website: {
      type: String,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
