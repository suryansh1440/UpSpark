import mongoose from "mongoose";

const startupSchema = new mongoose.Schema(
  {
    // BASIC INFO
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    tagline: {
      type: String,
      maxlength: 150,
    },

    logo: {
      type: String, // image URL (Cloudinary/S3)
    },

    industry: {
      type: String,
      required: true,
      index: true,
    },

    stage: {
      type: String,
      enum: ["idea", "mvp", "seed", "series-a"],
      default: "idea",
      index: true,
    },

    location: {
      type: String,
    },

    website: {
      type: String,
    },

    // PROBLEM & SOLUTION
    problem: {
      type: String,
      required: true,
    },

    solution: {
      type: String,
      required: true,
    },

    businessModel: {
      type: String,
    },

    targetMarket: {
      type: String,
    },

    // TRACTION
    traction: {
      users: {
        type: Number,
        default: 0,
      },
      revenue: {
        type: Number,
        default: 0,
      },
      growthRate: {
        type: Number, // percentage
        default: 0,
      },
    },

    // FUNDING
    fundingRequired: {
      type: Number,
    },

    equityOffered: {
      type: Number,
      min: 0,
      max: 100,
    },

    // MEDIA
    pitchDeckUrl: {
      type: String,
    },

    demoVideoUrl: {
      type: String,
    },

    // RELATIONS
    founder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    teamMembers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // STATUS FLAGS
    isVerified: {
      type: Boolean,
      default: false,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, 
  }
);


const Startup = mongoose.model("Startup", startupSchema);
export default Startup;
