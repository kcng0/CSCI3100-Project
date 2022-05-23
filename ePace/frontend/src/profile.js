import React from 'react';
import { uploadFiles, dbupdatePassword } from './firebase';

/**
 * A React component that allows the user to update their profile.           
 * @param {object} props - The props for the component.           
 * @returns A React component that allows the user to update their profile.           
 */
export function Profile(props) {
    const [newName, setNewName] = React.useState(''); // store new name of target user
    const [newPassword, setNewPassword] = React.useState(''); // store new password of target user
    const [newProfilePic, setNewProfilePic] = React.useState(''); // store new profile pic of target user

    const secionStyle = {
        marginTop: '20%',
        marginBottom: '20%',
    }

    /**
     * Submits the new name to the server.           
     * @param {Event} e - The event object.           
     * @returns None           
     */
    const submitNewName = (e) => {
        e.preventDefault();
        // check if new name is valid
        if (/^([\w]{2,})+\s+([\w\s]{2,})+$/i.test(newName) === false) {
            alert('Name is not valid');
        } else {
            // update name in database
            var urlencoded = new URLSearchParams();
            urlencoded.append("email", props.email);
            urlencoded.append("fullname", newName);

            var requestOptions = {
                method: 'POST',
                body: urlencoded,
                redirect: 'follow',
                url: 'http://localhost:1234/'
            };

            fetch("/updateName", requestOptions)
                .then(res => {
                    console.log(res)
                    if (res.status == '200') {
                        props.updateName(newName);
                        alert('Name updated successfully');
                    } else {
                        alert('Name update failed');
                    }
                })
        }
    }

    /**
     * Submits the new password to the database.       
     * @param {Event} e - the event that triggered the function.       
     * @returns None       
     */
    const submitNewPassword = (e) => {
        e.preventDefault();
        // check if new password is valid
        if (/^(?=.*[0-9a-zA-Z!@#$%^&*]).{8,}$/.test(newPassword) === false) {
            alert('Password is not valid');
        } else {
            // update password in database
            dbupdatePassword(props.email, newPassword)
                .catch((err) => {
                    console.log(err)
                    alert('Password update failed');
                })
        }
    }

    /**
     * Submits the new profile pic to the server.           
     * @param {Event} e - the event that triggered the function.           
     * @returns None           
     */
    const submitNewProfilePic = (e) => {
        e.preventDefault()
        // check if new profile pic is valid
        if (newProfilePic === undefined || newProfilePic === null) {
            alert('Please select a file');
        } else {
            // upload new profile pic to database
            uploadFiles(newProfilePic, props.email)
        }
    }

    // handle change of new name
    const updateName = (e) => {
        setNewName(e.target.value)
    }

    // handle change of new password
    const updatePassword = (e) => {
        setNewPassword(e.target.value)
    }

    // handle change of new profile pic
    const updateProfilePic = (e) => {
        setNewProfilePic(e.target.files[0])
        console.log(newProfilePic)
    }

    // image style: fixed 200px * 200px, rounded corners
    const imageStyle = {
        height: 200,
        width: 200,
        objectFit: "cover",
        borderRadius: '50%',
    }

    return (
        <section className="newsletter-subscribe" style={secionStyle}>
            <div className="container">
                <div className="intro">
                    <h1 className="text-center">Profile</h1>
                    {/* handle if profile pic exists */}
                    {props.profilepic !== undefined && <img style={imageStyle} class="mx-auto d-block" src={props.profilepic}/>}
                    {/* handle if profile pic does not exists */}
                    {props.profilepic === undefined && <img style={imageStyle} class="mx-auto d-block" src={"/defaulticon.png"}/>}

                    <h4 className="text-center">Email: {props.email}</h4>
                    <h4 className="text-center">Name: {props.name}</h4>
                    <h4 className="text-center">Gender: {props.gender}</h4>
                    <h4 className="text-center">Date of birth: {props.dob.slice(0, props.dob.indexOf("T"))}</h4>
                    <h4 className="text-center">Group ID: {props.groupID}</h4>
                </div>

                {/* Name */}
                <form className="d-flex justify-content-center flex-wrap" onSubmit={submitNewName}>
                    <div className="mb-3">
                        <input className="form-control" type="text" name="username" placeholder="New Name" onChange={updateName} />
                    </div>
                    <div className="mb-3">
                        <button className="btn btn-primary" type="submit">Update</button>
                    </div>
                </form>

                {/* Password */}
                <form className="d-flex justify-content-center flex-wrap" onSubmit={submitNewPassword}>
                    <div className="mb-3">
                        <input className="form-control" type="password" name="password" placeholder="New Password" minLength="8" maxLength="20" onChange={updatePassword} />
                    </div>
                    <div className="mb-3">
                        <button className="btn btn-primary" type="submit">Update</button>
                    </div>
                </form>

                {/* Profile pic */}
                <form className="d-flex justify-content-center flex-wrap" onSubmit={submitNewProfilePic}>
                    <div class="mb-3">
                        <input class="form-control" type="file" id="formFile" placeholder="New Profile Picture" accept="image/*" onChange={updateProfilePic} />
                    </div>

                    <div className="mb-3">
                        <button className="btn btn-primary" type="submit">Update</button>
                    </div>
                </form>
            </div>
        </section>
    )
}
