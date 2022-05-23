const express = require('express')
const router = express.Router()
const { userSchema } = require('./schema')


// create user model for database
var users = require('mongoose').model('users', userSchema);

// post request 'admin'
/**
 * A route that returns all users except the demo user.       
 * @param {Request} req - the request object       
 * @param {Response} res - the response object       
 * @returns None       
 */
router.post("/admin", (req, res) => {
    //list all users except the admin email
    users.find({ email: { $ne: "groupe6demo@gmail.com" } })
        .exec()
        .then(docs => {
            res.status(200);
            res.send(docs);
        })
        .catch(err => res.sendStatus(400))
})

module.exports = router;