import React from 'react';
import { useState } from 'react';
import './signin.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { useCookies } from 'react-cookie';
import { registerWithEmailAndPassword, sendEmail, logInWithEmailAndPassword } from './firebase';
import { v4 } from 'uuid';

/**
 * A functional component that renders the login form.           
 * @param {object} props - The props passed into the component.           
 * @returns A functional component that renders the login form.           
 */
function LogIn(props) {
    const [email, setEmail] = useState(''); // store email of user
    const [password, setPassword] = useState(''); // store password of user

    const [cookies, setCookie] = useCookies(); // access cookies

    const handleSubmit = (e) => {
        e.preventDefault();

        /**
         * Logs in the user with the given email and password.           
         * @param {string} email - the email of the user.           
         * @param {string} password - the password of the user.           
         * @returns None           
         */
        logInWithEmailAndPassword(email, password)
            // if success, add session in mongoDB
            .then(() => {
                var urlencoded = new URLSearchParams();
                urlencoded.append("email", email);
                urlencoded.append("password", password);

                var requestOptions = {
                    method: 'POST',
                    body: urlencoded,
                    redirect: 'follow',
                    url: 'http://localhost:1234/'
                };

                fetch("/login", requestOptions)
                    .then(res => {
                        if (res.status === '400') {
                            alert('Email or password is incorrect');
                            throw new Error('Email or password is incorrect');
                        }
                        return res.json()
                    })
                    .then(res => {
                        // store user info in react state
                        props.modifyRole(res[0].role)
                        props.modifyEmail(res[0].email)
                        props.modifyName(res[0].fullname)
                        props.modifyDOB(res[0].dob)
                        props.modifyGender(res[0].gender)
                        props.modifyGroupID(res[0].groupID)
                        return res[0]._id
                    })
                    .then((id) => {
                        const token = v4() // generate random token

                        let urlencoded = new URLSearchParams()
                        urlencoded.append("token", token)
                        urlencoded.append("id", id)

                        let requestOptions = {
                            method: 'POST',
                            body: urlencoded,
                            redirect: 'follow',
                            url: 'http://localhost:1234/'
                        }
                        fetch("/addSession", requestOptions)

                        setCookie("sessionToken", token) // add sessionToken in cookies
                        props.handleLoginRedirect(true) // redirect to home page
                    })
                    .catch(error => console.log('error', error));
            })
            .catch((err) => {
                // handle invalid email or password, email not verified
                if (err.message === 'email-not-verified') {
                    alert('Please verify your email address.');
                } else {
                    alert('Email or password is incorrect.');
                }
            })
    }

    // function for update "email" state during user input
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    // function for update "password" state during user input
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const formStyle = {
        borderRadius: '20px'
    }

    const buttonStyle = {
        background: '#0d6efd',
    }

    return (
        <section onSubmit={handleSubmit} className="login-clean">

            <form style={formStyle}>
                <h3>EPace</h3>
                <h2 className="visually-hidden">Login Form</h2>
                <div className="illustration"><i className="icon ion-information-circled"></i></div>
                {/* Email input */}
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input className="form-control" type="email" required="" autoFocus="" onChange={handleEmailChange} />
                </div>
                {/* Password input */}
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input className="form-control" type="password" required="" minLength="8" maxLength="20" onChange={handlePasswordChange} />
                </div>
                {/* Submit button */}
                <div className="mb-3">
                    <button className="btn btn-primary d-block w-100" type="submit" style={buttonStyle}>Login</button>
                </div>
                {/* Sign up button*/}
                <p className="forgot" onClick={props.handleHvAccount}>Don't have an account?</p>
            </form>
        </section>
    )
}


// Join workspace (teammate signup)
function JoinWorkspace(props) {
    const [email, setEmail] = useState(''); // store email of user
    const [password, setPassword] = useState(''); // store password of user
    const [fullname, setFullname] = useState(''); // store fullname of user
    const [dob, setDOB] = useState(''); // store date of birth of user
    const [gender, setGender] = useState(''); // store gender of user
    const [workspaceToken, setWorkspaceToken] = useState('') // store workspaceToken of user

    const [emailErr, setEmailErr] = useState(false); // stating whether email is invalid
    const [passwordErr, setPasswordErr] = useState(false); // stating whether password is invalid
    const [fullnameErr, setFullnameErr] = useState(false); // stating whether fullname is invalid
    const [dobErr, setDOBErr] = useState(false); // stating whether date of birth is invalid
    const [genderErr, setGenderErr] = useState(false); // stating whether gender is invalid
    const [workspaceTokenErr, setWorkspaceTokenErr] = useState(false); // stating whether workspaceToken is invalid

    /**
     * Handles the form submission.       
     * @param {Event} e - The event object.       
     * @returns None       
     */
    const handleSubmit = (e) => {
        e.preventDefault();

        let formValid = true
        // validate email
        if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(email) === false) {
            setEmailErr(true)
            formValid = false
        } else {
            setEmailErr(false)
        }
        // validate password
        if (/^(?=.*[0-9a-zA-Z!@#$%^&*]).{8,}$/.test(password) === false) {
            setPasswordErr(true)
            formValid = false
        } else {
            setPasswordErr(false)
        }
        // validate fullname
        if (/^([\w]{2,})+\s+([\w\s]{2,})+$/i.test(fullname) === false) {
            setFullnameErr(true)
            formValid = false
        } else {
            setFullnameErr(false)
        }
        // validate date of birth
        if (dob === '' || dob === null || dob === undefined) {
            setDOBErr(true)
            formValid = false
        } else {
            setDOBErr(false)
        }
        // validate gender
        if (gender === '' || gender === null || gender === undefined) {
            setGenderErr(true)
            formValid = false
        } else {
            setGenderErr(false)
        }
        // handle if workSpaceToken is null
        if (workspaceToken === '' || workspaceToken === null || workspaceToken === undefined) {
            setWorkspaceTokenErr(true)
            formValid = false
        } else {
            setWorkspaceTokenErr(false)
        }

        if (formValid === false) {
            return
        } else {
            let urlencoded = new URLSearchParams();
            urlencoded.append("grouptoken", workspaceToken);
            let requestOptions = {
                method: 'POST',
                body: urlencoded,
                redirect: 'follow',
                url: 'http://localhost:1234'
            }

            /**
             * Register the user with the given email and password.           
             * @param {string} email - The email of the user.           
             * @param {string} password - The password of the user.           
             * @returns None           
             */
            fetch("/checktoken", requestOptions)
                .then(res => {
                    console.log("res: ", res.status)
                    if (res.status === 400) {
                        setWorkspaceTokenErr(true)
                        throw new Error('wrong token')
                    } else {
                        setWorkspaceTokenErr(false)

                        registerWithEmailAndPassword(email, password) // register user with email and password in firebase
                            .then(() => {
                                sendEmail() // send verification email
                                    .then(() => {
                                        var urlencoded = new URLSearchParams();
                                        urlencoded.append("email", email)
                                        urlencoded.append("password", password)
                                        urlencoded.append("fullname", fullname)
                                        urlencoded.append("dob", dob)
                                        urlencoded.append("gender", gender)
                                        urlencoded.append("role", "2")
                                        urlencoded.append("grouptoken", workspaceToken)

                                        var requestOptions = {
                                            method: 'POST',
                                            body: urlencoded,
                                            redirect: 'follow',
                                            url: 'http://localhost:1234/'
                                        }

                                        // send user data to server
                                        fetch("/signup", requestOptions)
                                            .then(response => response.text())
                                            .then(result => {
                                                console.log(result);
                                                props.redirectLogin()
                                            })
                                            .catch(error => console.log('error', error));
                                    })
                            }).catch((err) => {
                                // handle if email is already in use
                                if (err.code === 'auth/email-already-in-use') {
                                    alert('Email already in use')
                                    setEmailErr(true)
                                }
                            })
                    }
                })
        }
    }


    // function for update "email" state during user input
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }
    // function for update "password" state during user input
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }
    // function for update "fullname" state during user input
    const handleFullnameChange = (e) => {
        setFullname(e.target.value);
    }
    // function for update "dob" state during user input
    const handleDOBChange = (e) => {
        setDOB(e.target.value);
    }
    // function for update "gender" state during user input
    const handleGenderChange = (e) => {
        setGender(e.target.value);
    }
    // function for update "workspaceToken" state during user input
    const handleWorkspaceTokenChange = (e) => {
        setWorkspaceToken(e.target.value);
    }

    const formStyle = {
        borderRadius: '20px'
    }
    const buttonStyle = {
        background: '#0d6efd',
    }

    return (
        <section className="login-clean">
            <form onSubmit={handleSubmit} style={formStyle}>
                <h2 className="visually-hidden">Login Form</h2>
                <div className="illustration"><i className="icon ion-information-circled"></i></div>
                <div className="mb-3">
                    <label className="form-label" style={{ color: emailErr ? 'red' : undefined }} >Email</label>
                    <input className="form-control" style={{ border: emailErr ? "1px solid red" : undefined }} type="email" required="" autoFocus="" onChange={handleEmailChange} />
                </div>
                <div className="mb-3">
                    <label className="form-label" style={{ color: passwordErr ? 'red' : undefined }}>Password (At least 8 characters)</label>
                    <input className="form-control" style={{ border: passwordErr ? "1px solid red" : undefined }} type="password" required="" minLength="8" maxLength="20" onChange={handlePasswordChange} /></div>
                <div className="mb-3">
                    <label className="form-label" style={{ color: fullnameErr ? 'red' : undefined }}>Full Name</label>
                    <input className="form-control" style={{ border: fullnameErr ? "1px solid red" : undefined }} type="text" required="" onChange={handleFullnameChange} />
                </div>
                <div className="mb-3">
                    <label className="form-label" style={{ color: dobErr ? 'red' : undefined }}>Date of birth</label>
                    <input className="form-control" style={{ border: dobErr ? "1px solid red" : undefined }} type="date" required="" onChange={handleDOBChange} />
                </div>
                <div className="mb-3">
                    <label className="form-label" style={{ color: genderErr ? 'red' : undefined }}>Gender</label>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" id="genderCheck-1" defaultChecked="" name="gender" value="M" onChange={handleGenderChange} />
                        <label className="form-check-label" htmlFor="genderCheck-1">Male</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" id="genderCheck-2" name="gender" value="F" onChange={handleGenderChange} />
                        <label className="form-check-label" htmlFor="genderCheck-2">Female</label>
                    </div>
                </div>
                <div className="mb-3">
                    <label className="form-label" style={{ color: workspaceTokenErr ? 'red' : undefined }}>Workspace Token</label>
                    <input className="form-control" style={{ border: workspaceTokenErr ? "1px solid red" : undefined }} type="text" required="" onChange={handleWorkspaceTokenChange} />
                </div>

                <div className="mb-3">
                    <button className="btn btn-primary d-block w-100" type="submit" style={buttonStyle}>Sign Up</button>
                </div>
                <p className="forgot" onClick={props.handleHvAccount}>Have an account?</p>
                <p className="forgot" onClick={props.updateSignUpPage}>Create Workspace?</p>
            </form>
        </section>
    )
}

/**
 * Create a workspace.           
 * @param {object} props - The props to pass to the component.           
 * @returns A workspace component.           
 */
function CreateWorkspace(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullname, setFullname] = useState('');
    const [dob, setDOB] = useState('');
    const [gender, setGender] = useState('');
    const [token, setToken] = useState('')
    const [displayShow, setDisplayShow] = useState(false)
    // const [role, setRole] = useState('');

    const [emailErr, setEmailErr] = useState(false);
    const [passwordErr, setPasswordErr] = useState(false);
    const [fullnameErr, setFullnameErr] = useState(false);
    const [dobErr, setDOBErr] = useState(false);
    const [genderErr, setGenderErr] = useState(false);
    // const [roleErr, setRoleErr] = useState(false);

    /**
     * Validates the form to make sure that all fields are filled in.       
     * @returns {boolean} - true if all fields are filled in, false otherwise.       
     */
    const validateForm = () => {
        let formValid = true
        if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(email) === false) {
            setEmailErr(true)
            formValid = false
        } else {
            setEmailErr(false)
        }

        if (/^(?=.*[0-9a-zA-Z!@#$%^&*]).{8,}$/.test(password) === false) {
            setPasswordErr(true)
            formValid = false
        } else {
            setPasswordErr(false)
        }

        if (/^([\w]{2,})+\s+([\w\s]{2,})+$/i.test(fullname) === false) {
            setFullnameErr(true)
            formValid = false
        } else {
            setFullnameErr(false)
        }
        if (dob === '' || dob === null || dob === undefined) {
            setDOBErr(true)
            formValid = false
        } else {
            setDOBErr(false)
        }

        if (gender === '' || gender === null || gender === undefined) {
            setGenderErr(true)
            formValid = false
        } else {
            setGenderErr(false)
        }

        // if (role === '' || role === null || role === undefined) {
        //     setRoleErr(true)
        //     formValid = false
        // } else {
        //     setRoleErr(false)
        // }

        return formValid
    }

    /**
     * Handles the form submission.       
     * @param {Event} e - The event object.       
     * @returns None       
     */
    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm() === false) {
            return
        }

        const token = v4()

        /**
         * Registers the user with the given email and password.           
         * @param {string} email - The email of the user.           
         * @param {string} password - The password of the user.           
         * @returns None           
         */
        registerWithEmailAndPassword(email, password)
            .then(() => {
                sendEmail().then(() => {
                    var urlencoded = new URLSearchParams();
                    urlencoded.append("email", email)
                    urlencoded.append("password", password)
                    urlencoded.append("fullname", fullname)
                    urlencoded.append("dob", dob)
                    urlencoded.append("gender", gender)
                    urlencoded.append("role", "1")
                    urlencoded.append("grouptoken", token)

                    var requestOptions = {
                        method: 'POST',
                        body: urlencoded,
                        redirect: 'follow',
                        url: 'http://localhost:1234/'
                    }
                    fetch("/signworkspace", requestOptions)
                        .then(response => response.text())
                        .then(result => {
                            // alert("Workspace created successfully\nPlease remember the token: " + token)
                            // props.redirectLogin()
                            setToken(token)
                            setDisplayShow(true)
                        })
                        .catch(error => console.log('error', error));
                })
            }).catch((err) => {
                if (err.code === 'auth/email-already-in-use') {
                    alert('Email already in use')
                    setEmailErr(true)
                }
            })
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const handleFullnameChange = (e) => {
        setFullname(e.target.value);
    }

    const handleDOBChange = (e) => {
        setDOB(e.target.value);
    }

    const handleGenderChange = (e) => {
        setGender(e.target.value);
    }

    // const handleRoleChange = (e) => {
    //     setRole(e.target.value);
    // }

    const formStyle = {
        borderRadius: '20px',
        display: !displayShow ? "block" : "none"
    }
    const buttonStyle = {
        background: '#0d6efd',
    }

    return (
        <section className="login-clean">
            <form onSubmit={handleSubmit} style={formStyle}>
                <h2 className="visually-hidden">Login Form</h2>
                <div className="illustration"><i className="icon ion-information-circled"></i></div>
                <div className="mb-3">
                    <label className="form-label" style={{ color: emailErr ? 'red' : undefined }} >Email</label>
                    <input className="form-control" style={{ border: emailErr ? "1px solid red" : undefined }} type="email" required="" autoFocus="" onChange={handleEmailChange} />
                </div>
                <div className="mb-3">
                    <label className="form-label" style={{ color: passwordErr ? 'red' : undefined }}>Password (At least 8 characters)</label>
                    <input className="form-control" style={{ border: passwordErr ? "1px solid red" : undefined }} type="password" required="" minLength="8" maxLength="20" onChange={handlePasswordChange} /></div>
                <div className="mb-3">
                    <label className="form-label" style={{ color: fullnameErr ? 'red' : undefined }}>Full Name</label>
                    <input className="form-control" style={{ border: fullnameErr ? "1px solid red" : undefined }} type="text" required="" onChange={handleFullnameChange} />
                </div>
                <div className="mb-3">
                    <label className="form-label" style={{ color: dobErr ? 'red' : undefined }}>Date of birth</label>
                    <input className="form-control" style={{ border: dobErr ? "1px solid red" : undefined }} type="date" required="" onChange={handleDOBChange} />
                </div>
                <div className="mb-3">
                    <label className="form-label" style={{ color: genderErr ? 'red' : undefined }}>Gender</label>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" id="genderCheck-1" defaultChecked="" name="gender" value="M" onChange={handleGenderChange} />
                        <label className="form-check-label" htmlFor="genderCheck-1">Male</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" id="genderCheck-2" name="gender" value="F" onChange={handleGenderChange} />
                        <label className="form-check-label" htmlFor="genderCheck-2">Female</label>
                    </div>
                </div>

                <div className="mb-3">
                    <button className="btn btn-primary d-block w-100" type="submit" style={buttonStyle}>Sign Up</button>
                </div>
                <p className="forgot" onClick={props.handleHvAccount}>Have an account?</p>
                <p className="forgot" onClick={props.updateSignUpPage}>Join Workspace?</p>
            </form>
            <div className="text-center" style={{ display: displayShow ? "block" : "none" }}>
                <h3>Please remember the following TOKEN!</h3>
                <h3>{token}</h3>
                <button className="btn btn-primary" onClick={props.redirectLogin}>Return</button>
            </div>

        </section>
    )
}

/**
 * A function that handles the sign up page.           
 * @param {object} props - the props for the sign up page.           
 * @returns None           
 */
function SignUp(props) {
    const [createWorkspace, setCreateWorkspace] = useState(false);

    const handleCreateWorkspace = (e) => {
        e.preventDefault();
        if (createWorkspace) {
            setCreateWorkspace(false);
        } else {
            setCreateWorkspace(true);
        }
    }

    if (!createWorkspace) {
        return (
            <JoinWorkspace updateSignUpPage={handleCreateWorkspace} handleHvAccount={props.handleHvAccount} handleLoginRedirect={props.handleLoginRedirect} redirectLogin={props.redirectLogin} />
        )
    } else {
        return (
            <CreateWorkspace updateSignUpPage={handleCreateWorkspace} handleHvAccount={props.handleHvAccount} handleLoginRedirect={props.handleLoginRedirect} redirectLogin={props.redirectLogin} />
        )
    }
}

/**
 * A function that handles the logic for the Welcome page component.           
 * @param {object} props - the props passed into the Welcome component.           
 * @returns None           
 */
export function Welcome(props) {
    const [hvAccount, setHvAccount] = useState(true);

    const handleChange = (e) => {
        e.preventDefault();
        if (hvAccount) {
            setHvAccount(false);
        } else {
            setHvAccount(true);
        }
    }

    const signUpRedirect = () => {
        setHvAccount(true);
    }

    if (hvAccount) {
        return (
            <LogIn handleHvAccount={handleChange} handleLoginRedirect={props.change} modifyRole={props.roleUpdate} modifyEmail={props.emailUpdate} modifyName={props.nameUpdate} modifyDOB={props.dobUpdate} modifyGender={props.genderUpdate} modifyGroupID={props.groupIDUpdate} />
        )
    } else {
        return (
            <SignUp handleHvAccount={handleChange} handleLoginRedirect={props.change} redirectLogin={signUpRedirect} />
        )
    }
}
