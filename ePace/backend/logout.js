const express = require('express')
const router = express.Router()
const { sessionSchema } = require('./schema')

// create session model for database
var sessions = require('mongoose').model('sessions', sessionSchema);

// post request 'logout'
router.post("/logout", (req, res) => {
    const filter = { token: req.body.sessionToken };

    //list session info with sessiontoken and delete the document
    sessions.findOneAndDelete(filter, function (err, docs) {
        if (err) {
            res.status(400).send("Unable to save to database");
        }
        else {
            res.send("delete");
        }
    });
});

module.exports = router;