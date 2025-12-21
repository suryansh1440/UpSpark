import FundingRequest from '../modals/funding.modal.js'
import Notification from '../modals/notification.modal.js'

export const getRequestsForFounder = async (req, res) => {
  try {
    // find funding requests where the startup's founder is the current user
    const list = await FundingRequest.find().populate('startup investor')
    const filtered = list.filter((r) => r.startup && String(r.startup.founder) === String(req.user._id))
    return res.json(filtered)
  } catch (err) {
    console.error('getRequestsForFounder error:', err)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const acceptRequest = async (req, res) => {
  try {
    const { requestId } = req.params
    const fr = await FundingRequest.findById(requestId).populate('startup investor')
    if (!fr) return res.status(404).json({ message: 'Funding request not found' })
    if (String(fr.startup.founder) !== String(req.user._id)) return res.status(403).json({ message: 'Forbidden' })
    if (fr.status !== 'pending') return res.status(400).json({ message: 'Only pending requests can be accepted' })
    fr.status = 'accepted'
    await fr.save()
    // notify investor
    try {
      await Notification.create({
        user: fr.investor._id || fr.investor,
        title: 'Funding Request Accepted 🎉',
        message: 'Founder accepted your funding proposal.',
        type: 'funding',
        link: '/dashboard/funding/investor',
      })
    } catch (e) {
      console.error('failed to create notification for funding acceptance:', e)
    }
    return res.json(fr)
  } catch (err) {
    console.error('acceptRequest error:', err)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const rejectRequest = async (req, res) => {
  try {
    const { requestId } = req.params
    const fr = await FundingRequest.findById(requestId).populate('startup investor')
    if (!fr) return res.status(404).json({ message: 'Funding request not found' })
    if (String(fr.startup.founder) !== String(req.user._id)) return res.status(403).json({ message: 'Forbidden' })
    if (fr.status !== 'pending') return res.status(400).json({ message: 'Only pending requests can be rejected' })
    fr.status = 'rejected'
    await fr.save()
    // notify investor
    try {
      await Notification.create({
        user: fr.investor._id || fr.investor,
        title: 'Funding Request Rejected',
        message: 'Founder declined your funding proposal.',
        type: 'funding',
        link: '/dashboard/funding/investor',
      })
    } catch (e) {
      console.error('failed to create notification for funding rejection:', e)
    }
    return res.json(fr)
  } catch (err) {
    console.error('rejectRequest error:', err)
    return res.status(500).json({ message: 'Server error' })
  }
}