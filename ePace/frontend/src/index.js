import React from 'react';
import ReactDOM from 'react-dom';
import { useState, useEffect, useLayoutEffect } from 'react';
import { BrowserRouter, HashRouter, Route, Routes, Link } from 'react-router-dom'
import { useCookies } from 'react-cookie';
import { useMatch, useLocation } from 'react-router-dom';
import './signin.css';
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.min.js'

import { Welcome } from './welcome';
import { Announcement } from './announcement';
import { Profile } from './profile';
import { Admin } from './admin'
import { Calendar } from './calendar';
import { Chat } from './chat';
import { Join } from './join';
import { logout } from './firebase'

/**
 * A React component that renders a navbar item.           
 * @param {string} name - The name of the item.           
 * @param {string} to - The path to the item.           
 * @param {Function} logout - The function to logout the user.           
 * @returns A React component that renders a navbar item.           
 */
function NavBarItem({ name, to, logout }) {
    let match = useMatch({ path: to });

    const itemStyle = {
        paddingLeft: 5
    }

    return (
        <li className="nav-item" style={itemStyle} onClick={logout}>
            <Link className="nav-link" to={to}>{name}</Link>
        </li>
    )
}

/**
 * A React component that renders the navigation bar.           
 * @param {Object} props - The props for the component.           
 * @returns A React component that renders the navigation bar.           
 */
function NavBar(props) {
    // User Parameters
    const [userName, setUserName] = useState(props.name);
    const [userGender, setGender] = useState(props.gender);
    const [userEmail, setEmail] = useState(props.email);
    const [userDOB, setDOB] = useState(props.dob)
    const [userType, setUserType] = useState(props.roleType);
    const [userGroupID, setUserGroupID] = useState(props.groupID);
    const [userProfilePic, setUserProfilePic] = useState(props.profilepic);

    const [cookies, removeCookie] = useCookies();

    // update userName
    function updateUserName(name) {
        setUserName(name);
    }

    const handlelogout = (e) => {
        e.preventDefault();
        logout();

        let urlencoded = new URLSearchParams();
        urlencoded.append('sessionToken', cookies.sessionToken);
        let requestOptions = {
            method: 'POST',
            body: urlencoded,
            redirect: 'follow',
            url: 'http://localhost:1234/'
        }

        fetch("/logout", requestOptions)
            .then(() => {
                removeCookie("sessionToken")
                props.nameUpdate('');
                props.emailUpdate('');
                props.genderUpdate('');
                props.dobUpdate('');
                props.roleUpdate('');
                props.changeStatus(false); 
            })

    }

    return (
        <HashRouter>
            <nav className="navbar navbar-expand-md navbar-dark bg-dark">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">EPace</a>
                    <button className="navbar-toggler ms-auto" type="button" data-bs-toggle="collapse"
                        data-bs-target="#collapseNavbar">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="navbar-collapse collapse" id="collapseNavbar">
                        <ul className="navbar-nav">
                            <NavBarItem name="Announcement" to="/" />
                            <NavBarItem name="Calendar" to="/calendar" />
                            <NavBarItem name="Join Chat" to="/join" />
                        </ul>
                        <ul className="navbar-nav ms-auto">
                            <NavBarItem name="Profile" to="profile" />
                            <NavBarItem name="Logout" to="/" logout={handlelogout} />
                        </ul>
                    </div>
                </div>
            </nav>

            <Routes>
                <Route path="/" element={<Announcement roleType={props.roleType} groupid={userGroupID}/>} />
                <Route path="/calendar" element={<Calendar roleType={props.roleType} groupID={userGroupID} />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/join" element={<Join email={userEmail} userName={userName} groupID = {userGroupID}/>} />
                <Route path="/profile" element={<Profile name={userName} gender={userGender} email={userEmail} dob={userDOB} updateName={updateUserName} groupID={userGroupID} profilepic={userProfilePic} updateProfilePic={setUserProfilePic}/>} />

            </Routes>
        </HashRouter>
    )
}


/**
 * A component that renders when the user navigates to a page that doesn't exist.           
 * @returns A component that renders when the user navigates to a page that doesn't exist.           
 */
function NoMatch() {
    let location = useLocation();
    return (
        <div>
            <h3>
                No match for <code>{location.pathname}</code>
            </h3>
        </div>
    );
}

/**
 * The main App component.           
 * @returns None           
 */
function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [gender, setGender] = useState('')
    const [roleType, setRoleType] = useState('');
    const [dob, setDOB] = useState('')
    const [groupID, setGroupID] = useState('')
    const [profilePic, setProfilePic] = useState('')

    const [cookies, setCookie, removeCookie] = useCookies();

    function changeStatus(status) {
        setIsLoggedIn(status);
    }

    function changeRole(role) {
        setRoleType(role);
    }

    function changeEmail(email) {
        setEmail(email);
    }

    function changeName(name) {
        setName(name);
    }

    function changeGender(gender) {
        setGender(gender)
    }

    function changeDOB(dob) {
        setDOB(dob)
    }

    function changeGroupID(groupID) {
        setGroupID(groupID)
    }

    function changeProfilePic(url) {
        setProfilePic(url)
    }

    /**
     * Checks if the user is logged in and if so, sets the state of the user's information.           
     * @returns None           
     */
    useEffect(() => {
        if (cookies.sessionToken) {
            let urlencoded = new URLSearchParams();
            urlencoded.append('sessionToken', cookies.sessionToken);
            let requestOptions = {
                method: 'POST',
                body: urlencoded,
                redirect: 'follow',
                url: 'http://localhost:1234/'
            }
            fetch('/checkSession', requestOptions)
                .then(res => {
                    return res.json()
                })
                .then(res => {
                    changeEmail(res.email);
                    changeRole(res.role);
                    changeName(res.fullname);
                    changeGender(res.gender);
                    changeDOB(res.dob);
                    changeGroupID(res.groupID);
                    changeProfilePic(res.profilePic);

                    changeStatus(true);
                })
                .catch(() => {
                    removeCookie("sessionToken")
                })
        }
    },[])

    // if not logged in, show login form
    if (!isLoggedIn) {
        return <Welcome change={changeStatus} roleUpdate={changeRole} emailUpdate={changeEmail} nameUpdate={changeName} dobUpdate={changeDOB} genderUpdate={changeGender} groupIDUpdate={changeGroupID}/>
    } else if (roleType !== '0') {
        return <NavBar name={name} gender={gender} email={email} roleType={roleType} dob={dob} groupID={groupID} changeStatus={changeStatus} roleUpdate={changeRole} emailUpdate={changeEmail} nameUpdate={changeName} dobUpdate={changeDOB} genderUpdate={changeGender} profilepic={profilePic} profilepicUpdate={changeProfilePic}/>
    } else {
        return <Admin change={changeStatus}/>
    }
}

// render the App component
ReactDOM.render(<App /> , document.getElementById('root'));
