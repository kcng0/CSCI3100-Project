import React from 'react';
import { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie';
import { dbupdatePassword, logout  } from './firebase'

/**
 * A React component that renders the admin page.           
 * @param {object} props - The props passed to the component.           
 * @returns A React component that renders the admin page.           
 */
export function Admin(props) {
    const [userInfo, setUserInfo] = useState([]); // store info of all users
    const [userEmail, setUserEmail] = useState(''); // store email of target user
    const [newPW, setNewPW] = useState(''); // store new password of target user

    const [cookies, removeCookie] = useCookies(); // access cookies

    const formStyle = {
        marginTop: '2.5%',
        marginBottom: '2.5%',
    }

    const buttonStyle = {
        width: '100%'
    }

    // function for update "newPW" state during user input
    const changePW = (e) => {
        setNewPW(e.target.value);
    }

    // function for update "userEmail" state during user input
    const changeEmail = (e) => {
        setUserEmail(e.target.value);
    }

    // function for handling form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        dbupdatePassword(userEmail, newPW)
    }

    /**
     * This function is called when the component is mounted.           
     * It fetches the user's information from the server and sets it to the state.           
     * @returns None           
     */
    useEffect(() => {
        let urlencoded = new URLSearchParams();
        var requestOptions = {
            method: 'POST',
            body: urlencoded,
            redirect: 'follow',
            url: 'http://localhost:1234/'
        };

        /**
         * Fetches the user info from the server.           
         * @returns None           
         */
        fetch("/admin", requestOptions)
            .then(response => response.json())
            .then(result => {
                setUserInfo(result);
            })
    }, [])

    
    /**
     * Handles the logout event.     
     * @param {Event} e - The event object.       
     * @returns None       
     */
    const handlelogout = (e) => {
        e.preventDefault();
        logout() // logout from firebase

        // remove sessionToken in database
        let urlencoded = new URLSearchParams();
        urlencoded.append('sessionToken', cookies.sessionToken)
        let requestOptions = {
            method: 'POST',
            body: urlencoded,
            redirect: 'follow',
            url: 'http://localhost:1234/'
        }

        fetch("/logout", requestOptions)
            .then(() => {
                // remove sessionToken in cookies
                removeCookie("sessionToken");
                props.change(false);
                window.location.reload()
            })
    }

    return (
        <div className="container">

            {/* table for displaying all user information */}
            <div className="table-responsive text-nowrap">
                <table className="table table-striped table-dark table-hover">
                    <thead class="table-dark">
                        <tr>
                            <th>UserID</th>
                            <th>Email</th>
                            <th>Password</th>
                            <th>Fullname</th>
                            <th>Gender</th>
                            <th>GroupID</th>
                            <th>Profilepic</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userInfo.map(obj => {
                            return (
                                <tr>
                                    <td>{obj._id}</td>
                                    <td>{obj.email}</td>
                                    <td>{obj.password}</td>
                                    <td>{obj.fullname}</td>
                                    <td>{obj.gender}</td>
                                    <td>{obj.groupID}</td>
                                    <td>{obj.profilePic}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            <hr />

            {/* form for updating user password */}
            <form onSubmit={handleSubmit}>
                <input className="form-control" type="email" placeholder="User Email" style={formStyle} onChange={changeEmail} required/>
                <input className="form-control" type="password" placeholder="New Password" style={formStyle} onChange={changePW} required minLength="8" maxLength="20"/>
                <button className="btn btn-primary" type="submit" style={buttonStyle}>Change Password</button>
            </form>

            {/* button for admin logout */}
            <button className="btn btn-warning" type="submit" style={buttonStyle} onClick={handlelogout}>Logout</button>
        </div>
    )
}
