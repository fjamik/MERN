const { Router } = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')
const User = require('../models/User')
const router = Router()

// /api/auth/register 
router.post(
  '/register',
  [
    check('email', 'Incorrect email').isEmail(),
    check('password', 'Minimum is 6 symbols').isLength({ min: 6 })

  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Incorrect data during register'
        })
      }


      const { email, password } = req.body

      const candidate = await User.findOne({ email })
      if (candidate) {
        return res.status(400).json({ message: 'This user existed already' })
      }

      const hashedPassword = await bcrypt.hash(password, 12)
      const user = new User({ email, password: hashedPassword })

      await user.save()

      res.status(201).json({ message: 'User created' })


    } catch (e) {
      res.status(500).json({ message: 'Error Server not found' })
    }

  })

// /api/auth/login 
router.post(
  '/login',
  [
    check('email', 'Input correct Email').normalizeEmail().isEmail(),
    check('password', 'Input Password' ).exists()
  ],
  async (req, res) => {

    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Input incorrect data during log in system'
        })
      }

      const { email, password } = req.body

      const user = await User.findOne({ email })

      if (!user) {
        return res.status(400).json({ message: 'User not found' })
      }

      const isMatch = await bcrypt.compare(password, this.user.password)
      if (!isMatch) {
        return res.status(400).json({ message: 'Incorrect password try again' })
      }


    } catch (e) {
      res.status(500).json({ message: 'Error Server not found' })
    }


  })

module.exports = router