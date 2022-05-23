import React from 'react';
import { useState } from 'react'
import { useEffect } from 'react/cjs/react.production.min';

/**
 * A React component that represents a card.           
 * @param {Object} props - The props for the component.           
 * @returns A React component that represents a card.           
 */
// announcement card
function Card(props) {
    return (
        <div className="card">
            <div className="card-body">
                <h4 className="card-title">{props.title}</h4>
                <h6 className="text-muted card-subtitle mb-2">{props.time}</h6>
                <p class="card-text">{props.content}</p>
            </div>
        </div>
    )
}

// form for adding announcement
/**
 * A React component that allows the user to add an announcement.        
 * @param {string} groupid - the group id of the group that the announcement is being added to.        
 * @returns None        
 */
function Form(props) {
    const [title, setTitle] = useState(''); // store title of announcement
    const [content, setContent] = useState(''); // store content of announcement

    // function for update "title" state during user input
    const changeTitle = (e) => {
        setTitle(e.target.value);
    }

    // function for update "content" state during user input
    const changeContent = (e) => {
        setContent(e.target.value);
    }

    // function for handling form submission
    const submitForm = (e) => {
        e.preventDefault();

        // handle if title or content is empty
        if (title === '' || content === '' || title === undefined || content === undefined) {
            alert('Please fill in all fields');
            return
        }

        const d = new Date();

        // send data to server
        // time format: YYYY-MM-DD HH:MM:SS
        let urlencoded = new URLSearchParams();
        urlencoded.append("groupID", props.groupid)
        urlencoded.append("title", title);
        urlencoded.append("content", content);
        urlencoded.append("time", `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`);
        var requestOptions = {
            method: 'POST',
            body: urlencoded,
            redirect: 'follow',
            url: 'http://localhost:1234/'
        }

        fetch("/addAnnouncement", requestOptions)
            .then(res => console.log(res))
            .then(() => window.location.reload())
    }

    const inputTitleStyle = {
        marginTop: "2.5%",
        marginBottom: "2.5%"
    }

    const inputContentStyle = {
        marginTop: "2.5%",
        marginBottom: "2.5%"
    }

    const buttonStyle = {
        width: "100%"
    }
    return (
        <div>
            <hr />
            <h3>Add Announcement</h3>
            <form onSubmit={submitForm}>
                <input className="form-control" type="text" placeholder="Announcement Title" style={inputTitleStyle} onChange={changeTitle} required/>
                <textarea className="form-control" placeholder="Announcement Content" rows="5" style={inputContentStyle} onChange={changeContent} required></textarea>
                <button className="btn btn-primary" style={buttonStyle}>Submit</button>
            </form>
        </div>
    )
}

/**
 * The Announcement component.           
 * @param {object} props - The props for the component.           
 * @returns The Announcement component.           
 */
// announcement component
export function Announcement(props) {
    const [announcement, setAnnouncement] = useState([]); // store announcement data

    /**
     * when page is loaded, fetch announcement data from server based on groupID          
     * @returns None           
     */
    useEffect(() => {
        let urlencoded = new URLSearchParams();
        urlencoded.append("groupID", props.groupid);

        var requestOptions = {
            method: 'POST',
            body: urlencoded,
            redirect: 'follow',
            url: 'http://localhost:1234/',
        }

        fetch("/announcement", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result);
                setAnnouncement(result);
            })
    }, [])

    return (
        <div className="container">
            <h1 className="text-center">Announcement</h1>
            {/* handle if there is no announcement */}
            {announcement.length !== 0 ? announcement.map(obj => <Card title={obj.title} time={obj.time} content={obj.content} groupid={props.groupid}/>) : <h3 className="text-center">No Announcement Is Available Yet!</h3>}
            {/* form is displayed only for team leaders */}
            {props.roleType === '1' && <Form groupid={props.groupid}/>}
        </div>
    )
}
