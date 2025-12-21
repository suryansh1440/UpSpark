import FundingRequest from '../modals/funding.modal.js'
import Notification from '../modals/notification.modal.js'
import Startup from '../modals/startup.modal.js'

export const sendFundingRequest = async (req, res) => {
  try {
    const { startupId, amount, message } = req.body
    if (!startupId || !amount) return res.status(400).json({ message: 'startupId and amount required' })

    const startup = await Startup.findById(startupId)
    if (!startup) return res.status(404).json({ message: 'Startup not found' })

    // defensive role check in controller (middleware should enforce this)
    const roles = req.user.roles || []
    if (!(roles.includes('investor') || req.user.activeRole === 'investor')) {
      return res.status(403).json({ message: 'Only investors can send funding requests' })
    }

    // prevent sending to own startup
    if (String(startup.founder) === String(req.user._id)) {
      return res.status(400).json({ message: 'Cannot send funding request to your own startup' })
    }

    const fr = await FundingRequest.create({ investor: req.user._id, startup: startup._id, amount, message })

    // notify founder about new funding request
    try {
      await Notification.create({
        user: startup.founder,
        title: 'New Funding Request',
        message: 'An investor has shown interest in your startup.',
        type: 'funding',
        link: '/dashboard/funding',
      })
    } catch (e) {
      console.error('failed to create notification for funding request:', e)
    }
    return res.status(201).json(fr)
  } catch (err) {
    console.error('sendFundingRequest error:', err)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const getMyFundingRequests = async (req, res) => {
  try {
    const list = await FundingRequest.find({ investor: req.user._id }).populate('startup')
    return res.json(list)
  } catch (err) {
    console.error('getMyFundingRequests error:', err)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const getFundingRequestById = async (req, res) => {
  try {
    const { requestId } = req.params
    const fr = await FundingRequest.findById(requestId).populate('startup investor')
    if (!fr) return res.status(404).json({ message: 'Funding request not found' })
    // only investor or admin can see
    if (String(fr.investor._id) !== String(req.user._id) && req.user.activeRole !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' })
    }
    return res.json(fr)
  } catch (err) {
    console.error('getFundingRequestById error:', err)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const withdrawFundingRequest = async (req, res) => {
  try {
    const { requestId } = req.params
    const fr = await FundingRequest.findById(requestId)
    if (!fr) return res.status(404).json({ message: 'Funding request not found' })
    if (String(fr.investor) !== String(req.user._id)) return res.status(403).json({ message: 'Forbidden' })
    if (fr.status !== 'pending') return res.status(400).json({ message: 'Can only withdraw pending requests' })
    fr.status = 'withdrawn'
    await fr.save()
    return res.json(fr)
  } catch (err) {
    console.error('withdrawFundingRequest error:', err)
    return res.status(500).json({ message: 'Server error' })
  }
}
