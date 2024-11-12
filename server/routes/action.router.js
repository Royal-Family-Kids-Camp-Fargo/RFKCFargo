const express = require('express');
const pool = require('../modules/pool');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');

const router = express.Router();

/** 
 * need donation post, get, put, delete
 * 
 * 
 */

/**
 * @swagger
 * /api/actions/{userId}:
 *   get:
 *     summary: Grabs actions by userId
 *     tags: [actions]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user whose submissions and donations are to be retrieved.
 *         schema:
 *           type: string
 *     responses:
 *      '200':
 *        description: A successful response containing the user's submissions and donations.
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  type:
 *                    type: string
 *                    enum: ['submission', 'donation']
 *                    description: The type of record (submission or donation).
 *                  id:
 *                    type: integer
 *                    description: The unique identifier for the submission or donation.
 *                  started_at:
 *                    type: string
 *                    format: date-time
 *                    description: The date and time when the submission or donation was initiated.
 *                  finished_at:
 *                    type: string
 *                    format: date-time
 *                    description: The date and time when the submission or donation was completed or updated.
 *                  name:
 *                    type: string
 *                    description: The name associated with the submission or donation.
 *      '404':
 *        description: User not found or no submissions/donations available.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  description: Error message indicating that the user was not found or has no records.
 *      '500':
 *        description: Internal server error.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  description: Error message indicating an internal server error.
 */
router.get('/:userId',rejectUnauthenticated, (req, res) => {
    const queryText = `
    select 
	(select json_agg(json_build_object(
		'type', 'submission', 
		'id', submission.id, 
		'started_at', submission.started_at, 
		'finished_at', submission.finished_at, 
		'name', (select "forms"."name" 
			from forms
			where forms.id = submission.form_id
			)
		)
		)
	from submission
	where submission.user_id = $1
	and submission.finished_at is not null
	) as user_submissions,
	(select json_agg(json_build_object(
		'type', 'donation', 
		'id', donation.id, 
		'started_at', donation.created_at, 
		'finished_at', donation.updated_at, 
		'name', 'Donation'
		)

		)
	from donation
	where donation.user_id = $1
	) as user_donations;
    `;
    pool.query(queryText, [req.params.userId]).then(response => {
        let newResponse = [
            ...response.rows[0].user_submissions,
            ...response.rows[0].user_donations
        ];
        newResponse.sort(function(a, b){ return new Date(a.finished_at).getTime() - new Date(b.finished_at).getTime()});
        console.log(newResponse);
        res.send(newResponse)
    }).catch(err => {
        console.error('Error grabbing actions', err);
        res.sendStatus(500);
    })
})

/**
 * @swagger
 * openapi: 3.0.0
 * info:
 *   title: Donations API
 *   version: 1.0.0
 *   description: API for managing donations.
 * paths:
 *   /api/actions/donation:
 *     post:
 *       tags:
 *         - donations
 *       summary: Create a new donation
 *       description: Inserts a new donation record into the database.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: integer
 *                   description: The ID of the user making the donation.
 *                 amount:
 *                   type: number
 *                   format: float
 *                   description: The amount of the donation.
 *               required:
 *                 - user_id
 *                 - amount
 *       responses:
 *         '200':
 *           description: Donation successfully created.
 *         '400':
 *           description: Bad request. Invalid input.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     description: Error message detailing the invalid input.
 *         '500':
 *           description: Internal server error.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     description: Error message indicating an internal server error.
 */
router.post('/donation', rejectUnauthenticated, (req, res) => {
    const queryText = `
    insert into donation (user_id, amount)
    values ($1, $2);
    `
    pool.query(queryText, [req.body.user_id, req.body.amount]).then(response => {
        res.sendStatus(200);
    }).catch(err => {
        console.error('Error creating donation', err);
        res.send(500);
    })
})

/**
 * @swagger
 * openapi: 3.0.0
 * info:
 *   title: Donations API
 *   version: 1.0.0
 *   description: API for managing donations.
 * paths:
 *   /api/actions/donation:
 *     put:
 *       tags:
 *         - donations
 *       summary: update the amount of an existing donation
 *       description: Updates the amount of the donation mand sets a new updated at time.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 amount:
 *                   type: number
 *                   format: float
 *                   description: The amount of the donation.
 *                 id:
 *                   type: integer
 *                   description: The ID of the donation.
 *               required:
 *                 - amount
 *                 - id
 *       responses:
 *         '200':
 *           description: Donation successfully updated.
 *         '400':
 *           description: Bad request. Invalid input.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     description: Error message detailing the invalid input.
 *         '500':
 *           description: Internal server error.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     description: Error message indicating an internal server error.
 */
router.put('/donation', rejectUnauthenticated, (req, res) => {
    const queryText = `
    update donation 
    set amount = $1, updated_at = (now() AT TIME ZONE 'utc'::text)
    where id = $2;
    `
    pool.query(queryText, [req.body.amount, req.body.id]).then(response => {
        res.sendStatus(200);
    }).catch(err => {
        console.error('Error updating donation', err);
        res.send(500);
    })
})


module.exports = router;