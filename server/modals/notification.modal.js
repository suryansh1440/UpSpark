import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      maxlength: 120,
    },

    message: {
      type: String,
      required: true,
      maxlength: 500,
    },

    type: {
      type: String,
      enum: ['funding', 'mentorship', 'collaboration', 'system', 'admin'],
      default: 'system',
      index: true,
    },

    link: {
      type: String,
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
)

notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 })

const Notification = mongoose.model('Notification', notificationSchema)
export default Notification
