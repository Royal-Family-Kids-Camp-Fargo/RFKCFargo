const express = require('express');
const pool = require('../modules/pool');

const router = express.Router();

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

    })
})

module.exports = router;