import React from 'react';
import { useState, useEffect } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import './chat.css'
import "bootstrap/dist/css/bootstrap.min.css";


/**
 * The chat component.           
 * @param {SocketIO.Socket} socket - The socket connection to the server.           
 * @param {string} email - The email of the user.           
 * @param {string} channel - The channel that the user is in.           
 * @param {string} userName - The username of the user.           
 * @returns The chat component.           
 */
export function Chat({ socket, email, channel, userName }) {
    // props contain userName, channel, email
    // states to hold current message, message list, and user list
    const [chat, setChat] = useState('');
    const [chatList, setChatList] = useState([]);
    const [userList, setUserList] = useState([]);

    // sending chat to the server when submit button is pressed
    const sendChat = async (e) => {
        e.preventDefault();
        if (chat != '') {
            const chatData = {
                username: userName,
                message: chat,
                room: channel,
                time: Date.now()
            };
            await socket.emit("message", chatData);
            setChatList((list) => [...list, chatData]);
            setChat('');
        }
    }

    // format date to be outputted
    const formatDate = (time) => {
        const date = new Date(time);
        return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
    }

    // update the message when new message is entered
    useEffect(() => {
        socket.on("savedMessage", (data) => {
            setChatList((list) => list.concat([].concat(...data)));
        });
    }, [])

    // load user list from the server when there the user list changes
    useEffect(() => {
        socket.on("Users", (data) => {
            setUserList(data);
            console.log(data);
        });
    }, [socket]);

    // load message list from database of the channel the page is loaded in
    useEffect(() => {
        socket.on("messageList", (data) => {
            setChatList((list) => [...list, data]);
            console.log("Added chat");
        });
    }, [socket]);

    return (
        <div className="container h-100">
            <div className="row h-100 justify-content-center align-items-center">
                <div className="col-10 col-md-8 col-lg-6 border-color" id="chatroom">

                    <div className="row grad">
                        <div className="col-md-10">
                            <h5 id="channelName" className="text-justify">
                                Channel:  {channel}
                            </h5>
                        </div>

                        <div className="mt-auto">
                            <a href="index.html">
                                <button type="button" className="btn btn-primary" style={{ width: "100%" }}>Leave</button>
                            </a>
                        </div>
                    </div>

                    { /* scroll the chat box to bottom automatically */}
                    <ScrollToBottom className="chat-box">
                        <div className="container">
                            {chatList.map((chatInfo) => {
                                return (
                                    <div className="card m-2">
                                        <div className="card-body">
                                            <h5 className="card-title">{chatInfo.username}</h5>
                                            <h6 className="card-subtitle mb-2 text-muted">{formatDate(chatInfo.time)}</h6>
                                            <p className="card-text">{chatInfo.message}</p>
                                        </div>
                                    </div>
                                )
                            })

                            }
                        </div>
                    </ScrollToBottom>

                    <br />

                    { /* message input box */}
                    <form className="form-inline d-flex justify-content-center flex-wrap" id="chat" onSubmit={sendChat}>
                        <div className="form-group mb-3">
                            <input
                                value={chat}
                                onChange={(event) => setChat(event.target.value)}
                                onKeyPress={(event) => { if (event.key === 'Enter') sendChat(event) }}
                                type="text"
                                className="form-control"
                                id="chat"
                                placeholder="Enter message"
                                required />
                        </div>
                        <div className="mb-3">
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </div>
                    </form>



                </div>

                <div className="col-4 align-items-start join-list" style={{marginTop: "2.5%"}}>
                    <h5>Users List</h5>
                    <ul className="list-group">
                        {userList.map((user) => {
                            if (user.username)
                            return (
                                <li className="list-group-item"> {user.username} </li>
                            )
                        })}
                    </ul>
                </div>

            </div>
        </div>
    )
}