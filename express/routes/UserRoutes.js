const express = require('express');
const router = express.Router();
const {
    decodeToken
} = require('../controllers/mid');
const {
    getAllUsers,
    getLoggedUserDetails
} = require('../controllers/user');

router.route('/').get(getAllUsers);
router.route('/logged').get( decodeToken , getLoggedUserDetails);
module.exports = router;