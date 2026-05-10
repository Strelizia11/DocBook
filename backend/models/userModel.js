import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String, default: '' },
  phone: { type: String, default: '' },
  address: {
    line1: { type: String, default: '' },
    line2: { type: String, default: '' },
  },
  gender: { type: String, default: 'Not Selected' },
  dob: { type: String, default: 'Not Selected' },
}, { timestamps: true })

const userModel = mongoose.models.user || mongoose.model('user', userSchema)
export default userModel