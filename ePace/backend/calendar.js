const express = require('express')
const router = express.Router()
const {calendarSchema} = require('./schema');

// create announcement model for database
var calendar = require('mongoose').model('calendar', calendarSchema);

//post request 'calendar'
/**
 * This route returns all events for a given group.    
 * @param {string} group - the group to get events for       
 * @returns {Promise<any>} - a promise that resolves to the events in the group       
 */
router.post('/calendar', (req, res) => {

    // list all users with the same groupID calendar event
    calendar.find( {group: req.body.group }).sort({start : 'asc'})
        .exec()
        .then(data => {
            //send document to frontend
            res.status(200);
            res.send(data);
        })
        .catch(err => res.sendStatus(400));
});

// post request 'addcalendar'
/**
 * Adds a calendar event to the database.           
 * @param {Request} req - The request object.           
 * @param {Response} res - The response object.           
 * @returns None           
 */
router.post('/addcalendar', (req, res) => {
    var data = new calendar(req.body);

    //insert calendar event to db
    data.save()
        .then(events => {
            res.sendStatus(200);
        })
        .catch(err => {
            res.sendStatus(400);
        });
});

// post request 'deletecalendar'
/**
 * Deletes a calendar entry from the database.       
 * @param {object} req - the request object.       
 * @param {object} res - the response object.       
 * @returns None       
 */
router.post('/deletecalendar', (req, res) => {
    var filter = {group:req.body.group,title:req.body.title,start:req.body.start};

    //delete calendar event inside db
    calendar.findOneAndDelete(filter,function(err,docs){
        if(err){
            res.sendStatus(400);
        }
        else{
            res.sendStatus(200);
        }

    })
});

module.exports = router;