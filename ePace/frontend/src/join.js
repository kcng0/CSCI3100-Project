import React from 'react';
import { useState, useEffect } from 'react';
import io from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css";
import { Chat } from './chat';


// joining group page
var socket;

/**
 * Check if the user has the permission to enter the chat channel          
 * @param {string} email - the email of the user.           
 * @param {string} channel - the channel that the user is in.           
 * @param {string} username - the username of the user.           
 * @param {string} groupID - the group ID of the channel.           
 * @returns {boolean} - true if the user is in the correct channel, false otherwise.           
 */
function checkUser(email, channel, username, groupID) {
    if (channel === groupID || channel === "Epace" || channel === "Debug") {
        socket = io();
        socket.emit("join", { username, channel });
        return true;
    } else {
        return false;
    }
}

// variable to save the chat channel name
var enteredChannel = "";

/**
 * A React component that renders a form to enter a channel.       
 * @param {object} props - The props passed to the component.       
 * @returns A form to enter a channel.       
 */
export function Join(props) {
    // state to save the channel name
    const [channel, setChannel] = useState('');

    // save the channel entered by the user
    const handleSubmit = (event) => {
        event.preventDefault();
        enteredChannel = channel;
        if (!checkUser(props.email, channel, props.username, props.groupID)) {
            alert("You do not have permission to enter this channel");
        }
        setChannel('');
    };

    // check if user entered the permitted channel, if yes, show the corresponding chat channel
    if (!checkUser(props.email, enteredChannel, props.userName, props.groupID)) {
        return (

            <div style={{ paddingTop: "15%" }}>

                {/* form of submitting the channel name */}
                <form onSubmit={handleSubmit} >
                    <div className="container h-100">
                        <div className="row h-100 justify-content-center align-items-center">
                            <div className="col-10 col-md-8 col-lg-6">
                                <h3> The general channel is : Epace </h3>
                                <div className="form-control">
                                    <label for="channel">Channel</label>
                                    <input type="text" value={channel} onChange={e => setChannel(e.target.value)} className="form-control" name="channel" id="channel" placeholder="Enter channel" required />
                                </div>

                                <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>Submit</button>

                            </div>
                        </div>
                    </div>

                </form>
            </div>
        )

    } else {
        return (<Chat socket={socket} email={props.email} channel={enteredChannel} userName={props.userName} />)
    }
}