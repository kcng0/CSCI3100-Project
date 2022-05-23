// import { userSchema, sessionSchema } from './5-schema'

const login = require('./login')
const signup = require('./signup')
const profile = require('./profile')
const logout = require('./logout')
const announcement = require('./announcement')
const admin = require('./admin')
const calendar = require('./calendar')
const { chatSchema } = require('./schema')

let express = require("express");
var bodyParser = require('body-parser');
let path = require("path")

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb+srv://admin:admin@groupe6.rnsub.mongodb.net/test?authSource=admin&replicaSet=atlas-vb2sx8-shard-0&readPreference=primary&ssl=true");
let app = express();
let port = 1234;

// load nessessary middleware
const http = require('http');
const socketio = require('socket.io');
const { userJoin, getUser, userLeave, getAllUser } = require('./utils/user');
const cors = require('cors');

// create a server
const server = http.createServer(app);

// create a socket
const io = socketio(server, {
    transports: ['polling'],
    cors: {
        cors: {
            origin: "http://localhost:1235",
            method: "GET"
        }
    }
});

// create chat model
var chat = mongoose.model("Chat", chatSchema);


app.use(express.static(path.join(__dirname, 'build')))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    console.log('login')
    res.sendFile(__dirname + '/index.html');
})


// when a user connects
/**
 * Function that handles the socket.io connection.           
 * @param {Socket} socket - the socket.io connection.           
 * @returns None           
 */
io.on('connection', socket => {

    // initialize a user variable
    var user;

    // when a user joins
    socket.on('join', ({ username, channel , email}) => {
        // if (username == undefined) {
        //     return
        // }
        

        // create corresponding user list
        if (getUser(username, channel, email)) {
            userLeave(username, channel, email);
        }
        user = userJoin(username, channel, email);

        // create virtual socket channel when a user connected
        console.log('New client connected to', user.channel, user.username);
        socket.join(user.channel);

        // sends the saved messages from the database to the corresponding virtual socket channel
        const filter = { room: user.channel };
            chat.find(filter).exec().then(docs => {
            socket.emit('savedMessage', (docs));
        })

        // emit the user list back to the client
        io.to(user.channel).emit('Users', getAllUser(user.channel));

    });

    // reveive message from the client and sends it back to the clients
    socket.on('message', (data) => {
        // console.log("DEBUG2", data.room)
        // if (data.room == undefined) {
        //     return
        // }

        console.log('message sented to Room' + data.room);
        var myData = new chat({ room: data.room, username: data.username, message: data.message, time: data.time });
        myData.save();
        socket.to(data.room).emit('messageList', data);
    });

    // emit the new user list to the clients when user disconnected
    socket.on("disconnect", () => {
        if (user) {
            userLeave(user.username, user.channel, user.email);
            io.to(user.channel).emit('Users', getAllUser(user.channel));
            console.log("user disconnected", user.username);
        }
    })

});


app.use(login)
app.use(signup)
app.use(profile)
app.use(logout)
app.use(announcement)
app.use(admin)
app.use(calendar)

server.listen(port, '0.0.0.0', () => {
    console.log("Server listening on port " + port);
});