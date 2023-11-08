const router = require('express').Router()
const ctrls = require('../controllers/user')

router.post('/register' , ctrls.register)
router.post('/login' , ctrls.login)

module.exports= router


// CRUD | Create - Read - Update _Delete | POST  - GET - PUT _DELETE