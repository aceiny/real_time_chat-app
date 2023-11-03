const express = require('express')
const router = express.Router()
const {
    sendMessage,
    getMessages
} = require('../controllers/message')

router.route('/new/:id').post(sendMessage)
router.route('/:id').get(getMessages)

module.exports = router 