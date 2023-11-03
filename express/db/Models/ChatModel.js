const {Schema , model} = require('mongoose')

const ChatSchema = new Schema({
    ChatName : {
        type : String ,
        trim : true ,
    },
    IsGroupChat : {
        type : Boolean ,
        default : false ,
    },
    users : [{
        type : Schema.Types.ObjectId ,
        ref : 'User'
    }],
    latestMessage : {
        type : Schema.Types.ObjectId ,
        ref : 'Message'
    },
    groupAdmin : {
        type : Schema.Types.ObjectId ,
        ref : 'User'
    }

}, {timestamps : true})
module.exports = model('Chat' , ChatSchema)