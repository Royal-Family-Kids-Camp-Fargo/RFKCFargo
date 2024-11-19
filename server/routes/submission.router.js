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
router.put('/', async (req, res) => {
    const OldSubmission = req.body.OldSubmission;
    const NewSubmission = req.body.NewSubmission;
    const oldAnswerIds = [];
    for(let i = 0; i < OldSubmission.answers.length; i++){
        oldAnswerIds.push(OldSubmission.answers[i].answer_id);
    }

    // I could just do a 'delete where submission id = req.params' but I need to do the delete second to ensure the safety of the data.
    const clearQuery = `
        delete from answer
        where id in ( 0, ${oldAnswerIds.join(', ')});
    `;

    const addQuery = `
        insert into answer ( "submission_id", "question_id", "user_id", "answer")
        values 
    `;
    let sanitizedAnswers = [];
    let sanitizedAnswersTracker = 1;
    for(let i = 0; i < NewSubmission.answers.length; i++){
        sanitizedAnswers.push(NewSubmission.answers[i].answer);
        addQuery +=`
        ( ${NewSubmission.id}, ${NewSubmission.answers[i].question[0].question_Id}, ${req.user.id}, $${sanitizedAnswersTracker++})
        `;
        if( i < NewSubmission.answers.length - 1){
            addQuery += ',';
        }
    }
    try {
        await pool.query(addQuery, [...sanitizedAnswers]);
        await pool.query(clearQuery);
        res.send(200);
    } catch (error) {
        console.log('Error saving form progress.', err);
        res.send(error).status(500);
    }
})

// Put for submission. Sets submission to finished.
router.put('/:submissionId/submit', (req, res) => {
    const queryText = `
        update submission
        set finished_at = now()
        where id = $1;
    `
    pool.query(queryText, [req.params.submissionId]).then(response => {
        res.send(200);
    }).catch(err => {
        console.error('Error submitting submission.', err);
        res.send(500);
    })
})
// Post for new form
router.post('/', (req, res) => {
    const queryText = `
        insert into submission ( user_id, form_id, started_at)\
        values ( $1, $2, now() );
    `
    pool.query(queryText, [req.user.id, req.body.form_id]).then(response => {
        res.send(200);
    }).catch(err => {
        console.error('Error posting new submission', err);
        res.send(err).status(500);
    })
})


module.exports = router;