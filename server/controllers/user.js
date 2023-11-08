const User = require('../models/user')
const asyncHandler = require('express-async-handler')
const {generateAccessToken} = require('../middlewares/jwt')

const register = asyncHandler(async (req, res) => {
    const { email, password, firstname, lastname } = req.body
    
    if (!email || !password || !lastname || !firstname)
        return res.status(400).json({
            sucess: false,
            mes: 'Missing inputs'
        })
        const user = await User.findOne({ email })
        if (user) throw new Error('User has existed')
        else {
            const newUser = await User.create(req.body)
            return res.status(200).json({
                sucess: newUser ? true : false,
                mes: newUser ? 'Register is successfully. Please go login~' : 'Something went wrong'
            })
        }
      
    })
    const login = asyncHandler(async (req, res) => {
        const { email, password, firstname, lastname } = req.body
        
        if (!email || !password )
            return res.status(400).json({
                sucess: false,
                mes: 'Missing inputs'
            })
            const response = await User.findOne({ email })
            if (response && await response.isCorrectPassword(password)) {
                // Tách password và role ra khỏi response
               const { password, role, refreshToken, ...userData } = response.toObject()
                // Tạo access token
               const accessToken = generateAccessToken(response._id, role)
                // Tạo refresh token
              //  const newRefreshToken = generateRefreshToken(response._id)
                // Lưu refresh token vào database
               // await User.findByIdAndUpdate(response._id, { refreshToken: newRefreshToken }, { new: true })
                // Lưu refresh token vào cookie
              //  res.cookie('refreshToken', newRefreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
                return res.status(200).json({
                    sucess: true,
                    accessToken,
                    userData 
                })
            } else {
                throw new Error('Invalid credentials!')
            }
          
        })
      module.exports ={
        register , 
        login
      }