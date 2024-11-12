const express = require('express');
const pool = require('../modules/pool');

const router = express.Router();

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
router.get('/:userId', (req, res) => {
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



module.exports = router;