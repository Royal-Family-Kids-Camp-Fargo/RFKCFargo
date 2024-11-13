const express = require('express');
const pool = require('../modules/pool');

const router = express.Router();

/**
 * Is there going there going to be one big form put?
 * go through and post/put/delete/archive everything that needs to be
 * 
 * Form
 *  Post form
 *  get form w/ sections
 *  update form
 *  delete form
 * 
 *  Post Sections
 *  get sections w/ questions
 * 
 *  archive questions
 * 
 * Submission
 * Post Submissions + answers in the submission
 */

router.post('/', (req, res) => {
    const queryText = `
        insert into forms("name")
        values($1);
    `
    pool.query(queryText, [req.body.name]).then(response => {
        res.send(200);
    }).catch(err => {
        console.error('Error posting form', err);
        res.send(500);
    })
})

module.exports = router;