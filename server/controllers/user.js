const User = require('../models/user')
const asyncHandler = require('express-async-handler')
const {generateAccessToken , generateRefreshToken} = require('../middlewares/jwt')
const jwt = require('jsonwebtoken')
const user = require('../models/user')


const register = asyncHandler(async (req, res) => {
    const { email, password, firstname, lastname } = req.body
    // console.log(req.body);
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
    // refressh token => cấp mới mới accctoeck

    const login = asyncHandler(async (req, res) => {
        const { email, password } = req.body
        
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
                const newRefreshToken = generateRefreshToken(response._id)
                // Lưu refresh token vào database
               await User.findByIdAndUpdate(response._id, { refreshToken: newRefreshToken }, { new: true })
                // Lưu refresh token vào cookie
                res.cookie('refreshToken', newRefreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
                return res.status(200).json({
                    sucess: true,
                    accessToken,
                    userData 
                })
            } else {
                throw new Error('Invalid credentials!')
            }
          
        })
        const getCurrent = asyncHandler(async (req, res) => {
            const { _id } = req.user
            const user = await User.findById(_id).select('-refreshToken -password -role')
            return res.status(200).json({
                success: user ? true : false,
                rs: user ? user : 'User not found'
            })
        })
        const refreshAccessToken = asyncHandler(async (req, res) => {
            // Lấy token từ cookies
            const cookie = req.cookies
            // Check xem có token hay không
            if (!cookie && !cookie.refreshToken) throw new Error('No refresh token in cookies')
            // Check token có hợp lệ hay không
            const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET)
            const response = await User.findOne({ _id: rs._id, refreshToken: cookie.refreshToken })
            return res.status(200).json({
                success: response ? true : false,
                newAccessToken: response ? generateAccessToken(response._id, response.role) : 'Refresh token not matched'
            })
        })
    
const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies
    if (!cookie || !cookie.refreshToken) throw new Error('No refresh token in cookies')
    // Xóa refresh token ở db
    await User.findOneAndUpdate({ refreshToken: cookie.refreshToken }, { refreshToken: '' }, { new: true })
    // Xóa refresh token ở cookie trình duyệt
    res.clearCookie('refreshToken', {
        httpOnly: true,                     // xoá nay k cần nhá
        secure: true
    })
    return res.status(200).json({
        success: true,
        mes: 'Logout is done'
    })
// Client gửi email
// Server check email có hợp lệ hay không => Gửi mail + kèm theo link (password change token)
// Client check mail => click link   // có thời gian làm thêm
// Client gửi api kèm token
// Check token có giống với token mà server gửi mail hay không
// Change password


})
const getUsers = asyncHandler(async (req, res) => {
    console.log(12444)
    const response = await User.find().select('-refreshToken -password -role')
    return res.status(200).json({
        success: response ? true : false,
        users: response
    })
})
const deleteUser = asyncHandler(async (req, res) => {
    const { _id } = req.query
    if (!_id) throw new Error('Missing inputs')
    const response = await User.findByIdAndDelete(_id)
    return res.status(200).json({
        success: response ? true : false,
        deletedUser: response ? `User with email ${response.email} deleted` : 'No user delete'
    })
})
const updateUser = asyncHandler(async (req, res) => {
    // thêm , chỉnh sửa người dùng
    const { _id } = req.user
    if (!_id || Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    const response = await User.findByIdAndUpdate(_id, req.body, { new: true }).select('-password -role -refreshToken')
    return res.status(200).json({
        success: response ? true : false,
        updatedUser: response ? response : 'Some thing went wrong'
    })
})
const updateCart = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const {pid , quantity , color} = req.body
    if (!pid || !quantity || !color) throw new Error('Missing inputs')
    const user = await User.findById(_id).select('cart')
    const alredyProduct = user?.cart?.find(el => el.product.toString() === pid)
if(alredyProduct) {
    

}else{
    const response = await User.findByIdAndUpdate(_id, {$push: {cart: {product: pid  , quantity , color}}} , {new: true})

    return res.status(200).json({
        success: response ? true : false,
        updatedUser: response ? response : 'Some thing went wrong'
    })

}
      

})


      module.exports ={
        register , 
        login,
        getCurrent,
        refreshAccessToken,
        logout,
        getUsers,
        deleteUser,
        updateUser,
        updateCart
    
      }