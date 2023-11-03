//importin all requirements 
const express = require('express')
const app = express()
const cors = require('cors')
const connectdb = require('./db/connectdb') //db connection fonction  //products routes
const NotFound = require('./extra/notfound') //not found handler
const errhandler = require('./extra/errhandler') //err handler
const {decodeToken} = require('./controllers/mid')   
require('dotenv').config()

// midddelwares 
    app.use(cors())
    app.use(express.json())
--
//get the routes 
    const AuthRoutes = require('./routes/AuthRoutes')
    const ChatRoutes = require('./routes/ChatRoutes')
    const UserRoutes = require('./routes/UserRoutes')
    const MessagesRoutes = require('./routes/MessagesRoutes')

//Routes Middelwares 
    app.use('/api/auth', AuthRoutes)
    app.use('/api/user', UserRoutes)
    app.use('/api/chat', decodeToken, ChatRoutes)
    app.use('/api/message', decodeToken, MessagesRoutes)

//handelers
    app.use(NotFound) //handle wrong route pathes
    app.use(errhandler) //handle server errs

//start the server 
const port = process.env.PORT || 8080
/*const start = async () => {
    try {
        await connectdb(process.env.MONGO) // connect to db
        return app.listen(port , console.log('listenin on port ' + port ))
    }catch(err) {
        console.log(err)
    }
}*/
connectdb(process.env.MONGO)
const server = app.listen(port , console.log('listenin on port ' + port ))
const io = require('socket.io')(server , {
            pingTimeout: 60000,
            cors : {
                origin : '*'
            }
        })
io.on('connection', (socket) => {
    console.log("connected")
    socket.on('setup',(user)=>{
        console.log("stp" , user )
        socket.join(user._id)
        socket.emit("connected")
    }); 
    socket.on('joinChat', (room) => {
        socket.rooms.forEach(r => {
            if(r !== room) socket.leave(r);
        })
        socket.join(room)
        console.log("joined room" , room)
    });
    socket.on('newMessage', (message) => {
        console.log("new message" , message)

        socket.to(message.Chat._id).emit('new-Message', message)
    })
})
