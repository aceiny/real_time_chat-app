const {model, Schema} = require('mongoose');

const MessageSchema = new Schema({
    Chat : {
        type : Schema.Types.ObjectId ,
        ref : 'Chat'
    },
    sender : {
        type : Schema.Types.ObjectId ,
        ref : 'User'
    },
    content : {
        type : String ,
        trim : true ,
    },
}, {timestamps : true})

module.exports = model('Message' , MessageSchema)