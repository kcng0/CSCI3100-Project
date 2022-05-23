const express = require('express')
const router = express.Router()

const { announceSchema } = require('./schema')


// create announcement model for database
var announcement = require('mongoose').model('announcement', announceSchema);

// post request 'announcement'
/**
 * A route that returns the announcements for a given group.       
 * @param {Request} req - The request object.       
 * @param {Response} res - The response object.       
 * @returns None       
 */
router.post("/announcement", (req, res) => {
    
    //list all users with the same groupID announcement
    announcement.find({ groupID: req.body.groupID }).sort({ time: 'desc' })
        .exec()
        .then(docs => {
            //send document to frontend
            res.status(200);
            res.send(docs);
        })
        .catch(err => res.sendStatus(400))
})

// post request 'addAnnouncement'
/**
 * Adds an announcement to the database.       
 * @param {object} req - the request object       
 * @param {object} res - the response object       
 * @returns None       
 */
router.post("/addAnnouncement", (req, res) => {
    var myData = new announcement(req.body);
    
    //insert announcement to db
    myData.save()
        .then(item => {
            res.sendStatus(200);
        })
        .catch(err => {
            res.sendStatus(400);
        });
})

module.exports = router;