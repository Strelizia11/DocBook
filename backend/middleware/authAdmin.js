import jwt from 'jsonwebtoken'

const authAdmin = (req, res, next) => {
  try {
    const { atoken } = req.headers
    if (!atoken) return res.json({ success: false, message: 'Not authorized, login again' })

    const decoded = jwt.verify(atoken, process.env.JWT_SECRET)
    if (decoded.email !== process.env.ADMIN_EMAIL) {
      return res.json({ success: false, message: 'Not authorized' })
    }
    next()
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

export default authAdmin
