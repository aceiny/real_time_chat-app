const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../db/Models/UserModel')
require('dotenv').config()
const comparePASS = (pass,hashpass) => { // compare the hash password with the password entered by the user to login 
    try{
      return bcrypt.compareSync(pass, hashpass)
    }catch(err){
      console.log(err)
    }
}
const createToken = (user) => { //fonction to generate jwt token 
    return jwt.sign({id : user._id,email:user.email},process.env.JWT_SECRET,{expiresIn: "30d"})
}

const searchEmail = async (em) => { //fonction to check if email already exist
    const email = await User.find({email : em})
    if(email.length > 0) {
      return true
    }
    return false
  }
  //end

const SignUp = async (req, res) => { // fonction to add user to a database (register)
    try {
      const {name,email,password} = req.body

        if(!name || !email || !password) {
          return res.status(400).json({status: 'a missing field'})
        }
        // check if email  already exist
        const emailTaken =  await searchEmail(email)
        if(emailTaken) {
          return res.status(400).json({status: 'email already exist'})
        }
      // end check
      // hash the password and create the user
        const salt = bcrypt.genSaltSync(10)
        const info = {
          ...req.body,
          password: bcrypt.hashSync(password, salt),
        }
        const user = await User.create(info)
        if(user) {
          return res.status(200).json({status : "Account created"})
        }
        return res.status(400).json({status: 'could not create user'})
      // end create user
    } catch (err) {
      console.log(err)
      res.status(500).json({err})
    }
}
const Login = async (req, res) => { //fonction to check if user exist and send the user token (login)
    const {email, password} = req.body
    console.log("ping")
    if(!email || !password) {
      return res.status(400).json({status: 'email and password are required'})
    }
    try {
      const user = await User.findOne({email})
      if(user){
        const passwordCorrect = await comparePASS(password,user.password)
        if(passwordCorrect) {
          const token = createToken(user)
          return res.status(200).json({status: 'logged in' ,id : user._id , token})
        }
        return res.status(400).json({status: 'password is wrong'})
      }
      return res.status(400).json({status: 'email is wrong'})
    } catch (err) {
        console.log(err)
      res.status(500).json({status: 'server error'})
    }
}
module.exports = {
    SignUp,
    Login
}