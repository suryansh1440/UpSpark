import mongoose from 'mongoose'

const FundingRequestSchema = new mongoose.Schema({
  investor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startup: { type: mongoose.Schema.Types.ObjectId, ref: 'Startup', required: true },
  amount: { type: Number, required: true },
  message: { type: String },
  status: { type: String, enum: ['pending','withdrawn','accepted','rejected'], default: 'pending' },
}, { timestamps: true })

export default mongoose.model('FundingRequest', FundingRequestSchema)
