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
 *  put sections
 *  get sections w/ questions
 * 
 *  Post form section relations
 *  Post questions
 * 
 * Submission
 * Post Submissions + answers in the submission
 */

module.exports = router;