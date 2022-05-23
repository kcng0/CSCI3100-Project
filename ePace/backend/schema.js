let mongoose = require("mongoose");

//mongodb model user
let userSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    email: {
        type: String,
        required: [true, "Email required"]
    },
    password: { type: String, required: true },
    gender: { type: String },
    role: { type: String },
    dob: { type: Date, required: true },
    groupID: { type: String },
    grouptoken: { type: String },
    profilePic: { type: String },
});

//mongodb model session
let sessionSchema = new mongoose.Schema({
    id: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    token: { type: String },
});

//mongodb model group
let groupSchema = new mongoose.Schema({
    id: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    token: { type: String },
});

//mongodb model announce
let announceSchema = new mongoose.Schema({
    groupID: { type: String },
    title: { type: String },
    time: { type: String },
    content: { type: String },
});

//mongodb model chat
let chatSchema = new mongoose.Schema({
    room: { type: String },
    username: { type: String },
    message: { type: String },
    time: { type: Date },
});

//mongodb model calendar
let calendarSchema = new mongoose.Schema({
    group: { type: String },
    title: { type: String },
    start: { type: String },
})

module.exports = { calendarSchema, userSchema, sessionSchema, groupSchema, announceSchema, chatSchema };