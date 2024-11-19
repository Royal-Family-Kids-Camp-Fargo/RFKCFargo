const express = require('express');
const pool = require('../modules/pool');

const router = express.Router();

// get submission by id
router.get('/:submissionId', (req, res) => {
    const queryText = `
    select
        id,
        user_id,
        form_id,
        started_at,
        finished_at,
        ( select
            json_agg(
                json_build_object(
                'question', (select
                    json_agg(
                        json_build_object(
                            'question_id', question.id,
                            'question', question.question,
                            'description', question.description,
                            'answer_type', question.answer_type,
                            'section_id', question.section_id,
                            'order', question.order  
                        )
                    )
                    from question
                    where question.id = answer.question_id
                ),
                'answer', answer.answer,
                'answer_id', answer.id
                )
            )
            from answer
            where answer.submission_id = submission.id
        ) as answers
    from submission
    where id = $1;
    `
    pool.query(queryText, [req.params.submissionId]).then(response => {
        res.send(response.rows);
    }).catch(err => {
        console.error('Error grabbing submission by id', err);
        res.send(500);
    });
})

// deletes submission by id. Answers get cascade deleted upon submission deletion.
router.delete('/:submissionId', (req, res) => {
    const queryText = `
        delete from submission where id = $1;
    `
    pool.query(queryText, [req.params.submissionId]).then(reponse => {
        res.send(201);
    }).catch(err => {
        console.error('Error deleting submission', err);
        res.send(500);
    })
})

// Put for submission. Saves progress.


// Post for submission. Saves progress and sets submission to finished.

router.post('/', (req, res) => {
    // req.body contains the form_id, user_id, and a list of potential answers

})


module.exports = router;