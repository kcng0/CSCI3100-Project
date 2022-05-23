const express = require('express')
const router = express.Router()
const { userSchema, sessionSchema } = require('./schema')

// create session and user model for database
var sessions = require('mongoose').model('sessions', sessionSchema);
var users = require('mongoose').model('users', userSchema);

// post request 'login'
/**
 * Takes in a request body and finds the user in the database.           
 * @param {Request} req - the request object           
 * @param {Response} res - the response object           
 * @returns None           
 */
router.post("/login", (req, res) => {
    const query = { email: req.body.email, password: req.body.password };

    //list user info with specific email and password
    users.find(query, function (err, docs) {
        if (err) {
            res.status(400);
            res.send("Unable to save to database");
        } else {
            //send document to frontend
            res.status(200);
            res.send(docs);
        }
    })
})

// post request 'addSession'
/**
 * Adds a session to the database.       
 * @param {Request} req - The request object.       
 * @param {Response} res - The response object.       
 * @returns None       
 */
router.post("/addSession", (req, res) => {
    var myData = new sessions(req.body);

    //insert session id to db   
    myData.save()
        .then(item => {
            res.sendStatus(200);
        })
        .catch(err => {
            res.sendStatus(400);
        });
})

// post request 'checkSession'
/**
 * Checks if the session token is valid and returns the user's ID.           
 * @param {string} sessionToken - the session token to check           
 * @returns {string} the user's ID           
 */
router.post("/checkSession", (req, res) => {

    //list user objectID with sessiontoken    
    sessions.find({ token: req.body.sessionToken })
        .exec()
        .then(docs => {
            //return array element 0 and turn to string
            return docs[0].id.toString()
        })
        .then(userID => {
            //list user info with specific objectID
            users.findById(userID, 'fullname email gender role dob groupID profilePic')
                .exec().then(docs => {
                    //send document to frontend
                    res.status(200);
                    res.send(docs);
                })
        })
        .catch(err => res.sendStatus(400))
})

module.exports = router;
