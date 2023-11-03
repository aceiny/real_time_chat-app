const Message = require('../db/Models/MessageModel');
const Chat = require('../db/Models/ChatModel');
const sendMessage = async(req,res) => {
    const {content} = req.body
    const {id:ChatId} = req.params
    try{
        console.log("pinged add message")
        if(!content){
            return res.status(400).json({status : "content is required"})
        }
        const message = {
            Chat : ChatId,
            sender : req.user.id,
            content
        }
        let newMessage = await Message.create(message)
        const chat = await Chat.findByIdAndUpdate(ChatId , {latestMessage : newMessage})
        return res.status(200).json({status : "succes" , newMessage})
    }catch(err){
        console.log(err)
        return res.status(500).json({status : err})
    }
}
const getMessages = async(req,res) => {
    const {id} = req.params
    try {
        const messages = await Message.find({Chat : id}).populate('sender','name email profilePic')
        return res.status(200).json({status : "succes" , messages})
    } catch (err) {
        console.log(err)
        return res.status(500).json({status : err})
    }
}
module.exports = {
    sendMessage,
    getMessages
}