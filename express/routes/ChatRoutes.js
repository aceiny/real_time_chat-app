const express = require('express')
let router = express.Router() // 
const {
    accesChat,
    getChats
} = require('../controllers/chat')

router.get('/:id', accesChat)
router.get('/', getChats)

module.exports = router //export the router