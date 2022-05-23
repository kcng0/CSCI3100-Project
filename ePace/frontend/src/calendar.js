import React, { useState } from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from "@fullcalendar/daygrid";
import { useEffect } from 'react/cjs/react.production.min';
import "./calendar.css";


/**
 * A React component that renders a calendar.           
 * @param {string} groupID - the group ID of the group that the calendar is for.           
 * @returns None           
 */
export function Calendar(props) {

    const [calEvents, setCalEvents] = useState([]);
    const [addFormData, setAddFormData] = useState({
        title: '',
        start: ''
    })
    
    /**
     * Handles the change event for the form fields.       
     * @param {Event} event - the event object       
     * @returns None       
     */
    const handleChange = (event) => {
        event.preventDefault();

        const fieldName = event.target.getAttribute('name');
        const fieldValue = event.target.value;

        const newFormData = { ...addFormData };
        newFormData[fieldName] = fieldValue;
        console.log(newFormData);

        setAddFormData(newFormData);
    }

    /**
     * Handles the form submission.           
     * @param {Event} event - the event object           
     * @returns None           
     */
    const handleSubmit = (event) => {
        event.preventDefault();

        const newCalEvent = {
            group: props.groupID,
            title: addFormData.title,
            start: addFormData.start
        };

        const newCalEvents = [...calEvents, newCalEvent];
        console.log(newCalEvents);
        setCalEvents(newCalEvents);

        // fetch data to the server
        let urlencoded = new URLSearchParams();
        urlencoded.append("group", props.groupID);
        urlencoded.append("title", newCalEvent.title);
        urlencoded.append("start", newCalEvent.start);
        var requestOptions = {
            method: 'POST',
            body: urlencoded,
            redirect: 'follow',
            url: "http://localhost:1234/"
        }

        fetch("/addcalendar", requestOptions)
            .then(res => console.log(res))
    }

    
    /**
     * Fetches the calendar events from the server.           
     * @returns None           
     */
    useEffect(() => {
        let urlencoded = new URLSearchParams();
        urlencoded.append("group", props.groupID);
        var requestOptions = {
            method: 'POST',
            body: urlencoded,
            redirect: 'follow',
            url: "http://localhost:1234/"
        };

        fetch("/calendar", requestOptions)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setCalEvents(data);
            });
    }, [])


    /**
     * Handles the deletion of a calendar event.           
     * @param {Event} event - the event that triggered the function           
     * @param {string} title - the title of the event to delete           
     * @param {string} start - the start time of the event to delete           
     * @returns None           
     */
    function handleDelete(event, title, start) {
        let urlencoded = new URLSearchParams();
        urlencoded.append("group", props.groupID);
        urlencoded.append("title", title);
        urlencoded.append("start", start);
        var requestOptions = {
            method: 'POST',
            body: urlencoded,
            redirect: 'follow',
            url: "http://localhost:1234/"
        }

        fetch("/deletecalendar", requestOptions)
            .then(res => console.log(res))
            .then(() => window.location.reload())
    }

    const inputStyle = {
        marginTop: "1%",
        marginBottom: "1%"
    }

    return (
        <div className="container">
            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={calEvents}
            />
            <div className="table-responsive text-nowrap">
                <table className="table table-striped table-dark table-hover">
                    <thead>
                        <tr>
                            <th>Event Name</th>
                            <th>Date</th>
                            {props.roleType === "1" && <th></th>}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            calEvents.map((calEvent) => (
                                <tr>
                                    <td>{calEvent.title}</td>
                                    <td>{calEvent.start}</td>
                                    {props.roleType === "1" && <td> <button onClick={(e) => handleDelete(e, calEvent.title, calEvent.start)} className="btn btn-warning">Delete</button></td>}
                                </tr>
                            ))
                        }

                    </tbody>
                </table>
            </div>
            <hr />
            {props.roleType === "1" &&

                <form className="d-flex justify-content-center flex-wrap" onSubmit={handleSubmit}>
                    <h2>Add an event</h2>
                    <input className="form-control" type="text" name="title" required="required" style={inputStyle} placeholder="Enter Title..." onChange={handleChange} />
                    <br />
                    <input className="form-control" type="date" name="start" required="required" style={inputStyle} onChange={handleChange} />
                    <button className="btn btn-primary" type="submit" style={{ width: '100%' }}>Add</button>
                </form>
            }

        </div>
    );
};
