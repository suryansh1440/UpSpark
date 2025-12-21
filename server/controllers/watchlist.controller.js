import Watchlist from '../modals/watchlist.modal.js'
import Startup from '../modals/startup.modal.js'

export const addToWatchlist = async (req, res) => {
  try {
    const { startupId } = req.params
    const startup = await Startup.findById(startupId)
    if (!startup) return res.status(404).json({ message: 'Startup not found' })

    // create if not exists
    try {
      const doc = await Watchlist.create({ investor: req.user._id, startup: startup._id })
      return res.status(201).json(doc)
    } catch (err) {
      // duplicate key -> already saved
      if (err.code === 11000) return res.status(200).json({ message: 'Already in watchlist' })
      throw err
    }
  } catch (err) {
    console.error('addToWatchlist error:', err)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const getWatchlist = async (req, res) => {
  try {
    const list = await Watchlist.find({ investor: req.user._id }).populate('startup')
    return res.json(list.map((i) => i.startup))
  } catch (err) {
    console.error('getWatchlist error:', err)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const removeFromWatchlist = async (req, res) => {
  try {
    const { startupId } = req.params
    await Watchlist.deleteOne({ investor: req.user._id, startup: startupId })
    return res.json({ message: 'Removed' })
  } catch (err) {
    console.error('removeFromWatchlist error:', err)
    return res.status(500).json({ message: 'Server error' })
  }
}
