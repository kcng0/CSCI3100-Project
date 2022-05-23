const express = require('express')
const router = express.Router()
const { userSchema, groupSchema } = require('./schema')

//create user and group model for database
var users = require('mongoose').model('users', userSchema);
var group = require('mongoose').model('groups', groupSchema);

//post request 'checktoken'
/**
 * Checks if the group token is valid.           
 * @param {Request} req - The request object.           
 * @param {Response} res - The response object.           
 * @returns None           
 */
router.post("/checktoken", (req, res) => {

    //list group info check token existence
    group.find({ token: req.body.grouptoken }).exec()
        .then(docs => {
            if (docs.length == 0) {
                res.sendStatus(400);
            } else {
                res.sendStatus(200);
            }
        })
})

// post request 'signup'
/**
 * A function that takes in a user's signup information and saves it to the database.           
 * @param {Request} req - The request object.           
 * @param {Response} res - The response object.           
 * @returns None           
 */
router.post("/signup", (req, res) => {
    var myData = new users(req.body);
    var grouptoken = req.body.grouptoken;

    //insert teammate to db
    myData.save()
        .then(item => {

            //list created user objectID by email
            users.find({ email: req.body.email }).exec()
                .then(docs => {
                    //objectID => String
                    return docs[0].id.toString()
                })
                .then(userID => {

                    //update group for created user
                    group.findOneAndUpdate({ token: grouptoken }, { $push: { id: userID } }).exec();
                    //list group objectID by grouptoken
                    group.find({ token: req.body.grouptoken })
                        .exec()
                        .then(docs => {
                            //objectID => String
                            return docs[0]._id.toString()
                        })
                        .then(groupid => {
                            //update user info for specific groupid
                            users.findOneAndUpdate({ email: req.body.email }, { groupID: groupid })
                                .exec();
                        })
                    res.sendStatus(200);
                })
        })
        .catch(err => {
            res.status(400).send("Unable to save");
        });
});

// post request 'signworkspace'
/**
 * Takes in a request body and saves the user's information to the database.           
 * @param {Request} req - the request object           
 * @param {Response} res - the response object           
 * @returns None           
 */
router.post("/signworkspace", (req, res) => {
    var myData = new users(req.body);
    var grouptoken = req.body.grouptoken;

    //insert teamleader to db   
    myData.save()
        .then(items => {
            //list created user objectID by email
            users.find({ email: req.body.email }).exec()
                .then(docs => {
                    //objectID => String
                    return docs[0].id.toString()
                })
                .then(userID => {
                    var newData = new group({ id: userID, token: grouptoken });

                    //insert group to db  
                    newData.save()
                        .then(docs => {
                            //list created group objectID by email
                            group.find({ token: req.body.grouptoken })
                                .exec()
                                .then(docs => {
                                    //objectID => String
                                    return docs[0]._id.toString()
                                })
                                .then(groupid => {
                                    //update user info for specific groupid
                                    users.findOneAndUpdate({ email: req.body.email }, { groupID: groupid })
                                        .exec();
                                })
                            res.sendStatus(200);
                        })
                })
        })
        .catch(err => {
            console.log(err)
            res.status(400).send("Unable to save");
        });
});

module.exports = router;