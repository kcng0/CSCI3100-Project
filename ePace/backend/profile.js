const express = require('express')
const router = express.Router()
const { userSchema } = require('./schema')

// create user model for database
var users = require('mongoose').model('users', userSchema);

// post request 'updateName'
/**
 * Updates the user's full name in the database.       
 * @param {Request} req - The request object.       
 * @param {Response} res - The response object.       
 * @returns None       
 */
router.post("/updateName", (req, res) => {
    const filter = { email: req.body.email };
    const update = { fullname: req.body.fullname };

    //list user info with email and update the document 'new Name'
    users.findOneAndUpdate(filter, update, function (err, docs) {
        if (err) {
            res.status(400);
            res.send("Unable to update");
        } else {
            res.sendStatus(200);
        }
    })
})

// post request 'uploadProfilePicUrl'
/**
 * Updates the profile pic url for the user with the given email.           
 * @param {string} email - the email of the user to update.           
 * @param {string} profilePic - the new profile pic url.           
 * @returns None           
 */
router.post("/uploadProfilePicUrl", (req, res) => {
    const filter = { email: req.body.email };
    const update = { profilePic: req.body.profilePic };

    //list user info with email and update the document 'new ProfilePic 
    users.findOneAndUpdate(filter, update, function (err, docs) {
        if (err) {
            res.status(400);
            res.send("Unable to update");
        } else {
            res.sendStatus(200);
        }
    })
})

// post request 'updatePassword'
/**
 * Updates the password of the user with the given email.       
 * @param {string} email - the email of the user to update       
 * @param {string} password - the new password of the user       
 * @returns None       
 */
router.post("/updatePassword", (req, res) => {
    const filter = { email: req.body.email };
    const update = { password: req.body.password };

    //update password for specific user
    users.findOneAndUpdate(filter, update, function (err, docs) {
        if (err) {
            res.status(400);
            res.send("Unable to update");
        } else {
            //send document out to frontend
            res.status(200);
            res.send(docs);
        }
    })
})

module.exports = router;
