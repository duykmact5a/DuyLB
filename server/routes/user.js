const router = require('express').Router()
const ctrls = require('../controllers/user')
const { verifyAccessToken , isAdmin} = require('../middlewares/verifyToken')

router.post('/register' , ctrls.register)
router.post('/login' , ctrls.login)
router.get('/current', verifyAccessToken, ctrls.getCurrent)
router.post('/refreshtoken', ctrls.refreshAccessToken)
router.get('/logout',ctrls.logout)
router.get('/', [verifyAccessToken, isAdmin],ctrls.getUsers)
router.delete('/', [verifyAccessToken, isAdmin],ctrls.deleteUser)
router.put('/current', [verifyAccessToken],ctrls.updateUser)
router.put('/cart' , [verifyAccessToken] , ctrls.updateCart)


module.exports= router


// CRUD | Create - Read - Update _Delete | POST  - GET - PUT _DELETE