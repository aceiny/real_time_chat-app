const express = require('express')
let router = express.Router() // 

const {
    SignUp,
    Login
} = require('../controllers/auth') // import the functions from the functions folder


router.post('/login', Login )
router.post('/signup', SignUp)

module.exports = router //export the router 