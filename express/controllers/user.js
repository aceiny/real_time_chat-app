const User = require('../db/Models/UserModel');

const getAllUsers = async(req,res) => {
    try {
        let {name} = req.query
        if(!name){
            name = ""
        }
        name = { $regex: name, $options: "i" }
        const users = await User.find({name}).select("-password")
        return res.status(200).json({status : "succes" , users})
    }catch(err){
        console.log(err)
        return res.status(500).json({status : err})
    }
}
const getLoggedUserDetails = async(req,res) => {
    const {id} = req.user
    try {
        const user = await User.findById(id).select("-password")
        if (user) {
            return res.status(200).json({status : "succes" , user})
        }
        return res.status(400).json({status : "user not found"})
    } catch (err) {
        
    }
}
module.exports = {
    getAllUsers,
    getLoggedUserDetails
}