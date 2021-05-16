const jwt = require('jsonwebtoken')

exports.auth = (req, res, next) => {
  try {
    const { authorization } = req.headers

    if(!authorization) {
      throw new Error('Your session has expired')
    }

    const [_, token] = authorization.split(' ')

    if(!token) {
      throw new Error('Your session has expired')
    }

    const { userEmail } = jwt.verify(token, process.env.SECRET)

    req.user = userEmail

    next()
  } catch(error) {
    res.status(401).json({ message: error.message })
  }
}