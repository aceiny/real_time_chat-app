const Chat = require('../db/Models/ChatModel');
const User = require('../db/Models/UserModel');

const accesChat = async(req,res) => {
    const {id} = req.params
    if(!id){
        return res.status(400).json({status : "id is required"})
    }
    try {
        const chat = await Chat.find({
            IsGroupChat : false ,
            $and: [
                { users: { $elemMatch: { $eq: req.user.id } } },
                { users: { $elemMatch: { $eq: id } } },
            ],
        })
        .populate('users' , "-password")
        .populate('latestMessage')
        if (chat.length > 0) {
            res.status(200).json({chat : chat[0]})
        }else {
            const chatData = {
              chatName: "sender",
              isGroupChat: false,
              users: [req.user.id, id],
            };
            try{
                const chat = await Chat.create(chatData)
                const fullChat = await Chat.findById(chat._id).populate('users' , "-password").populate('latestMessage')
                res.status(200).json({chat : fullChat})
            }catch(err){
                console.log(err)
                res.status(500).json({err})
            }
        }
    }catch(err){
        console.log(err)
        res.status(500).json({err})
    }
}
const getChats = async(req,res) => {
    try{
        let chats = Chat.find({
            users: { $elemMatch: { $eq: req.user.id } } 
        })
        .populate('users' , "-password")
        .populate('latestMessage')
        .populate('groupAdmin' , "-password")
        .sort({updatedAt : -1})
        chats = await chats.sort({updatedAt : -1})
        res.status(200).json({chats})

    }catch(err){
        console.log(err)
        res.status(500).json({status : err})
    }
}
const CreateGroupChat = async(req,res) => {
    const {users , name} = req.body
    if (!users || !name) {
        return res.status(400).json({status : "users and name are required"})
    }
    users = JSON.parse(users)
    users.push(req.user.id)
    try {
        const chat = await Chat.create({
            chatName : name ,
            IsGroupChat : true ,
            users,
            groupAdmin : req.user.id
        })
        const fullChat = await Chat.findById(chat._id).populate('users' , "-password").populate('groupAdmin' , "-password")
        res.status(200).json({chat : fullChat})
    }catch(err){
        console.log(err)
        res.status(500).json({status : err})
    }
}
const RenameGroupChat = async(req,res) => {
    const {id} = req.params
    const {name} = req.body
    try {
        const updateChat = Chat.findByIdAndUpdate(id , {chatName : name} , {new : true})
        if(updateChat){
            res.status(200).json({status : "chat renamed"})
        }
        res.status(400).json({status : "error"})
    }catch(err){
        console.log(err)
        res.status(500).json({status : err})
    }


}
const RemoveFromGroup = async(req,res) =>{
    const {id} = req.params
    const {userId} = req.body
    try {
        const chat = await Chat.findByIdAndUpdate(id,{$pull : {users : userId}} , {new : true})
        if(chat){
            res.status(200).json({status : "user removed"})
        }
        res.status(400).json({status : "error"})
    }catch(err){
        console.log(err)
        res.status(500).json({status : err})
    }
}
const AddToGroup = async(req,res) => {
    const {id} = req.params
    const {userId} = req.body
    try {
        const chat = await Chat.findByIdAndUpdate(id,{$push : {users : userId}} , {new : true})
        if(chat){
            res.status(200).json({status : "user added"})
        }
        res.status(400).json({status : "error"})
    } catch (err) {
        console.log(err)
        res.status(500).json({status : err})
    }
}
module.exports = {
    accesChat,
    getChats
}