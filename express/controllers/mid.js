const jwt = require('jsonwebtoken')
require('dotenv').config()

const decodeToken = (req, res, next) => { // mideelware to decode the token
    const token = req.headers.auth
    if(!token) {
        return res.status(401).json({status: 'no token provided'})
    }
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.user = {
            id : payload.id,
            email : payload.email
        }
        next()
    }catch(err){   
        console.log(err) 
        res.status(401).json({status: 'invalid token'})
    }

}
const checkToken = (req,res) => {
    const {token} = req.body
    if(!token) {
        return res.status(401).json({status: 'no token provided'})
    }
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        if(payload) {
            return res.status(200).json({status: 'valid token'})
        }
    }catch(err){    
        res.status(401).json({status: 'invalid token'})
    }
}
module.exports = {
    decodeToken,
    checkToken
}