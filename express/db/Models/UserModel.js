const {Schema , model} = require('mongoose')

const UserSchema = new Schema({
    name : {
        type : String ,
        trim : true ,
        required : true ,
    },
    email : {
        type : String ,
        trim : true ,
        required : true ,
    },
    password : {
        type : String ,
        required : true ,
    },
    profilePic : {
        type : String ,
        default : 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg' ,
    },
}, {timestamps : true} )

module.exports = model('User' , UserSchema)