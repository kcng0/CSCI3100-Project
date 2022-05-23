import {
    initializeApp,
} from "firebase/app";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    sendEmailVerification,
    updatePassword,
} from "firebase/auth";
import {
    getStorage,
    ref,
    getDownloadURL,
    uploadBytesResumable
} from "firebase/storage";
const firebaseConfig = {
    apiKey: "AIzaSyBeA8HDppzfCWyc_2DCQzoqxuENiB_Yqq8",
    authDomain: "csci3100-76e93.firebaseapp.com",
    projectId: "csci3100-76e93",
    storageBucket: "csci3100-76e93.appspot.com",
    messagingSenderId: "781101404855",
    appId: "1:781101404855:web:d6d47652a7003548733332"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage();

/**
 * Logs in the user with the given email and password.           
 * @param {firebase.auth.Auth} auth - The authentication object.           
 * @param {string} email - The email of the user.           
 * @param {string} password - The password of the user.           
 * @returns None           
 */
const logInWithEmailAndPassword = async (email, password) => {
    //firebase signin user
    const a = await signInWithEmailAndPassword(auth, email, password);

    //user email not verified then alert
    if (!a.user.emailVerified) {
        throw new Error("email-not-verified");
    }
};

/**
 * Registers a user with the given email and password.       
 * @param {string} email - the email of the user.       
 * @param {string} password - the password of the user.       
 * @returns None       
 */
const registerWithEmailAndPassword = async (email, password) => {
    //firebase create user 
    const res = await createUserWithEmailAndPassword(auth, email, password);
};

/**
 * Sends an email verification to the user.           
 * @returns None           
 */
const sendEmail = async () => {
    try {
        //send email vertification 
        await sendEmailVerification(auth.currentUser);
        alert("Verification email sent!");
    } catch (err) {
        //alert error 
        console.error(err);
        alert(err.message);
    }
};

/**
 * Updates the password of the user with the given email.       
 * @param {string} email - the email of the user to update the password for.       
 * @param {string} password - the new password for the user.       
 * @returns None       
 */
const dbupdatePassword = async (email, password) => {
    let urlencoded = new URLSearchParams();
    urlencoded.append("email", email);
    urlencoded.append("password", password)
    let requestOptions = {
        method: 'POST',
        body: urlencoded,
        redirect: 'follow',
        url: 'http://localhost:1234/'
    }

    //post request 'updatePassword'
    fetch("/updatePassword", requestOptions)
        .then(res => res.json())
        .then(res => {
            //sign out current user
            signOut(auth)
                .then(() => {
                    //sign in the wanted user account
                    signInWithEmailAndPassword(auth, email, res.password).then((res) => {
                        //update password 
                        const user = res.user;
                        updatePassword(user, password)
                            .then(() => {
                                alert("Update password!");
                                window.location.reload()
                            })
                            .catch(err => console.log(err))
                    })
                })

                .catch(err => console.log(err))
        })
}

/**
 * Logs the user out of the application.           
 * @returns None           
 */
const logout = () => {
    signOut(auth);
};

/**
 * Uploads a file to the firebase storage and returns the download url.       
 * @param {File} file - the file to upload       
 * @param {string} email - the email of the user       
 * @returns None       
 */
const uploadFiles = async (file, email) => {
    //file return if null
    if (!file) return;

    //create ref
    const sotrageRef = ref(storage, `files/${file.name}`);
    //upload file
    const uploadTask = uploadBytesResumable(sotrageRef, file);

    uploadTask.on(
        "state_changed",
        (snapshot) => {
            //monitoring upload process
            const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            console.log('Upload is ' + progress + '% done');
        },
        (error) => console.log(error),
        async () => {
            //get file download url 
            getDownloadURL(uploadTask.snapshot.ref)
                .then((downloadURL) => {
                    console.log("File available at", downloadURL);
                    let urlencoded = new URLSearchParams();
                    urlencoded.append("email", email);
                    urlencoded.append("profilePic", downloadURL);

                    let requestOptions = {
                        method: 'POST',
                        body: urlencoded,
                        redirect: 'follow',
                        url: 'http://localhost:1234/'
                    }
                    //post request 'uploadProfilePicUrl'
                    fetch("/uploadProfilePicUrl", requestOptions)
                        .then(res => {
                            console.log("RES:", res)
                            if (res.status == '200') {
                                alert('Profile pic upload successfully');
                                window.location.reload()
                            } else {
                                alert('Profile pic upload failed');
                            }
                        })
                });

        }
    );
};

export {
    auth,
    logInWithEmailAndPassword,
    registerWithEmailAndPassword,
    logout,
    sendEmail,
    uploadFiles,
    dbupdatePassword,
};
