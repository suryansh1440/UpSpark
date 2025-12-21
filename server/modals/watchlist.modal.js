import mongoose from 'mongoose'

const WatchlistSchema = new mongoose.Schema({
  investor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startup: { type: mongoose.Schema.Types.ObjectId, ref: 'Startup', required: true },
}, { timestamps: true })

WatchlistSchema.index({ investor: 1, startup: 1 }, { unique: true })

export default mongoose.model('Watchlist', WatchlistSchema)
