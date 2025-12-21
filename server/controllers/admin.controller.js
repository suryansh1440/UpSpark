import Startup from "../modals/startup.modal.js";
import Notification from '../modals/notification.modal.js'
import User from "../modals/user.modal.js";
import FundingRequest from "../modals/funding.modal.js";
import CollaborationPost from "../modals/collaborationPost.modal.js";
import mongoose from "mongoose";

/* ==================
  Users
  ================== */
export const getAllUsers = async (req, res) => {
  try {
    const { role, isBlocked, page = 1, limit = 50 } = req.query;
    const q = {};
    if (role) q.roles = { $in: [role] };
    if (isBlocked !== undefined) q.isBlocked = isBlocked === 'true' || isBlocked === true;
    const total = await User.countDocuments(q);
    const results = await User.find(q).select('-password').skip((page - 1) * limit).limit(Number(limit));
    return res.json({ total, page: Number(page), limit: Number(limit), results });
  } catch (error) {
    console.error('getAllUsers error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}

export const blockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId)) return res.status(400).json({ message: 'Invalid id' });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isBlocked = true;
    await user.save();
    // notify user
    try { await Notification.create({ user: user._id, title: 'Account Restricted', message: 'Your account has been restricted by admin.', type: 'admin' }) } catch (e) { console.error('notify blockUser failed', e) }
    return res.json({ message: 'User blocked', user: await User.findById(user._id).select('-password') });
  } catch (error) {
    console.error('blockUser error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}

export const unblockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId)) return res.status(400).json({ message: 'Invalid id' });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isBlocked = false;
    await user.save();
    try { await Notification.create({ user: user._id, title: 'Account Restored', message: 'Your account restrictions have been lifted.', type: 'admin' }) } catch (e) { console.error('notify unblockUser failed', e) }
    return res.json({ message: 'User unblocked', user: await User.findById(user._id).select('-password') });
  } catch (error) {
    console.error('unblockUser error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}

export const verifyUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId)) return res.status(400).json({ message: 'Invalid id' });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isVerified = true;
    await user.save();
    try { await Notification.create({ user: user._id, title: 'Account Verified', message: 'Your account has been verified by admin.', type: 'admin' }) } catch (e) { console.error('notify verifyUser failed', e) }
    return res.json({ message: 'User verified', user: await User.findById(user._id).select('-password') });
  } catch (error) {
    console.error('verifyUser error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId)) return res.status(400).json({ message: 'Invalid id' });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    // soft-delete: block and remove roles
    user.isBlocked = true;
    user.roles = [];
    await user.save();
    try { await Notification.create({ user: user._id, title: 'Account Removed', message: 'Your account has been removed by admin.', type: 'admin' }) } catch (e) { console.error('notify deleteUser failed', e) }
    return res.json({ message: 'User soft-deleted' });
  } catch (error) {
    console.error('deleteUser error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}

/* ==================
  Funding
  ================== */
export const getAllFundingRequests = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query
    const total = await FundingRequest.countDocuments({})
    const results = await FundingRequest.find({}).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)).populate('startup investor')
    return res.json({ total, page: Number(page), limit: Number(limit), results })
  } catch (error) {
    console.error('getAllFundingRequests error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const getFundingRequestById = async (req, res) => {
  try {
    const { requestId } = req.params
    if (!mongoose.isValidObjectId(requestId)) return res.status(400).json({ message: 'Invalid id' })
    const fr = await FundingRequest.findById(requestId).populate('startup investor')
    if (!fr) return res.status(404).json({ message: 'Funding request not found' })
    return res.json(fr)
  } catch (error) {
    console.error('getFundingRequestById error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const cancelFundingRequest = async (req, res) => {
  try {
    const { requestId } = req.params
    if (!mongoose.isValidObjectId(requestId)) return res.status(400).json({ message: 'Invalid id' })
    const fr = await FundingRequest.findById(requestId).populate('startup investor')
    if (!fr) return res.status(404).json({ message: 'Funding request not found' })
    fr.status = 'cancelled'
    await fr.save()
    // notify parties
    try { await Notification.create({ user: fr.investor._id || fr.investor, title: 'Funding Request Cancelled', message: 'An admin cancelled this funding request.', type: 'funding', link: '/dashboard/funding/investor' }) } catch (e) { console.error('notify cancelFundingRequest investor failed', e) }
    try { await Notification.create({ user: fr.startup.founder, title: 'Funding Request Cancelled', message: 'An admin cancelled a funding request for your startup.', type: 'funding', link: '/dashboard/funding' }) } catch (e) { console.error('notify cancelFundingRequest founder failed', e) }
    return res.json({ message: 'Funding request cancelled', fr })
  } catch (error) {
    console.error('cancelFundingRequest error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}

/* ==================
  Collaboration
  ================== */
export const getAllCollaborationPostsAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 50, active } = req.query
    const q = {}
    if (active !== undefined) q.isActive = active === 'true' || active === true
    const total = await CollaborationPost.countDocuments(q)
    const results = await CollaborationPost.find(q).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)).populate('postedBy startup')
    return res.json({ total, page: Number(page), limit: Number(limit), results })
  } catch (error) {
    console.error('getAllCollaborationPostsAdmin error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const disableCollaborationPost = async (req, res) => {
  try {
    const { postId } = req.params
    if (!mongoose.isValidObjectId(postId)) return res.status(400).json({ message: 'Invalid id' })
    const post = await CollaborationPost.findById(postId).populate('postedBy')
    if (!post) return res.status(404).json({ message: 'Post not found' })
    post.isActive = false
    await post.save()
    try { await Notification.create({ user: post.postedBy._id || post.postedBy, title: 'Post Disabled', message: 'An admin disabled your collaboration post.', type: 'collaboration', link: '/dashboard/collaboration' }) } catch (e) { console.error('notify disableCollaborationPost failed', e) }
    return res.json({ message: 'Post disabled', post })
  } catch (error) {
    console.error('disableCollaborationPost error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const deleteCollaborationPost = async (req, res) => {
  try {
    const { postId } = req.params
    if (!mongoose.isValidObjectId(postId)) return res.status(400).json({ message: 'Invalid id' })
    const post = await CollaborationPost.findById(postId)
    if (!post) return res.status(404).json({ message: 'Post not found' })
    await post.deleteOne()
    return res.json({ message: 'Post deleted' })
  } catch (error) {
    console.error('deleteCollaborationPost error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}

/* ==================
  Notifications / Stats
  ================== */
export const sendSystemNotification = async (req, res) => {
  try {
    const { userId, title, message } = req.body
    if (!title || !message) return res.status(400).json({ message: 'Title and message are required' })
    if (userId) {
      if (!mongoose.isValidObjectId(userId)) return res.status(400).json({ message: 'Invalid user id' })
      await Notification.create({ user: userId, title, message, type: 'system' })
      return res.json({ message: 'Notification sent' })
    }
    // broadcast to all users
    const users = await User.find().select('_id')
    const docs = users.map((u) => ({ user: u._id, title, message, type: 'system' }))
    await Notification.insertMany(docs)
    return res.json({ message: 'Broadcast sent', recipients: users.length })
  } catch (error) {
    console.error('sendSystemNotification error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({})
    const totalStartups = await Startup.countDocuments({})
    const verifiedStartups = await Startup.countDocuments({ isVerified: true })
    const fundingRequests = await FundingRequest.countDocuments({})
    const activeCollabPosts = await CollaborationPost.countDocuments({ isActive: true })

    // users by role
    const roles = ['founder', 'investor', 'collaborator', 'admin']
    const usersByRolePromises = roles.map((r) => User.countDocuments({ roles: r }))
    const usersByRoleCounts = await Promise.all(usersByRolePromises)
    const usersByRole = roles.reduce((acc, r, i) => ({ ...acc, [r]: usersByRoleCounts[i] }), {})

    // startups by month for last 6 months
    const months = 6
    const now = new Date()
    const startDate = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1)

    const agg = await Startup.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $project: { yearMonth: { $dateToString: { format: '%Y-%m', date: '$createdAt' } } } },
      { $group: { _id: '$yearMonth', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ])

    // build ordered months array with labels
    const monthLabels = []
    for (let i = 0; i < months; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - (months - 1) + i, 1)
      monthLabels.push({ key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`, label: d.toLocaleString('default', { month: 'short' }) })
    }

    const startupsByMonth = monthLabels.map((m) => {
      const found = agg.find((a) => a._id === m.key)
      return { month: m.label, startups: found ? found.count : 0 }
    })

    return res.json({ totalUsers, totalStartups, verifiedStartups, fundingRequests, activeCollabPosts, usersByRole, startupsByMonth })
  } catch (error) {
    console.error('getAdminStats error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const getAllStartupsAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 50, verified } = req.query
    const q = {}
    if (verified !== undefined) q.isVerified = verified === 'true' || verified === true
    const total = await Startup.countDocuments(q)
    const results = await Startup.find(q).skip((page - 1) * limit).limit(Number(limit)).populate('founder', 'name email')
    return res.json({ total, page: Number(page), limit: Number(limit), results })
  } catch (error) {
    console.error('getAllStartupsAdmin error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const getPendingStartups = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 20
    const q = { isVerified: false, isActive: true }
    const total = await Startup.countDocuments(q)
    const results = await Startup.find(q).skip((page - 1) * limit).limit(limit).populate('founder', 'name email')
    return res.json({ total, page, limit, results })
  } catch (error) {
    console.error('getPendingStartups error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const rejectStartup = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.startupId)
    if (!startup) return res.status(404).json({ message: 'Startup not found' })
    startup.isActive = false
    startup.isVerified = false
    await startup.save()
    try {
      await Notification.create({
        user: startup.founder,
        title: 'Startup Rejected',
        message: 'Your startup was rejected. Please update details and resubmit.',
        type: 'admin',
        link: '/dashboard',
      })
    } catch (e) {
      console.error('notify rejectStartup failed', e)
    }
    return res.json({ message: 'Startup rejected' })
  } catch (error) {
    console.error('rejectStartup error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const verifyStartup = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.startupId)
    if (!startup) return res.status(404).json({ message: 'Startup not found' })
    startup.isVerified = true
    await startup.save()
    try {
      await Notification.create({ user: startup.founder, title: 'Startup Verified 🎉', message: 'Your startup has been approved and is now visible to investors.', type: 'admin', link: '/dashboard' })
    } catch (e) { console.error('notify verifyStartup failed', e) }
    return res.json({ message: 'Startup verified', startup })
  } catch (error) {
    console.error('verifyStartup error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}
