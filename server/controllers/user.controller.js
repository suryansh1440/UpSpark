import User from '../modals/user.modal.js'
import bcrypt from 'bcryptjs'
import cloudinary from '../lib/cloudinary.js'
import streamifier from 'streamifier'

export const getMe = async (req, res) => {
  try {
    // req.user is populated by protectRoute (without password)
    return res.json(req.user)
  } catch (err) {
    console.error('getMe error:', err)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const allowed = ['name', 'bio', 'location', 'website', 'linkedinUrl', 'avatar']
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    allowed.forEach((k) => {
      if (req.body[k] !== undefined) user[k] = req.body[k]
    })
    await user.save()
    const safe = await User.findById(user._id).select('-password')
    return res.json(safe)
  } catch (err) {
    console.error('updateProfile error:', err)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const updateAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' })
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    const uploadResult = await new Promise((resolve, reject) => {
      const upload_stream = cloudinary.uploader.upload_stream(
        { folder: 'avatars', resource_type: 'image' },
        (error, result) => {
          if (error) return reject(error)
          resolve(result)
        }
      )
      streamifier.createReadStream(req.file.buffer).pipe(upload_stream)
    })

    user.avatar = uploadResult.secure_url
    await user.save()
    const safe = await User.findById(user._id).select('-password')
    return res.json(safe)
  } catch (err) {
    console.error('updateAvatar error:', err)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword) return res.status(400).json({ message: 'Missing fields' })
    const user = await User.findById(req.user._id).select('+password')
    if (!user) return res.status(404).json({ message: 'User not found' })
    const ok = await bcrypt.compare(currentPassword, user.password)
    if (!ok) return res.status(400).json({ message: 'Current password is incorrect' })
    user.password = await bcrypt.hash(newPassword, 10)
    await user.save()
    return res.json({ message: 'Password updated' })
  } catch (err) {
    console.error('changePassword error:', err)
    return res.status(500).json({ message: 'Server error' })
  }
}


export const deactivateAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    // soft-deactivate
    user.isBlocked = true
    await user.save()
    return res.json({ message: 'Account deactivated' })
  } catch (err) {
    console.error('deactivateAccount error:', err)
    return res.status(500).json({ message: 'Server error' })
  }
}

export default {}
