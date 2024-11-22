const express = require('express');
const pool = require('../modules/pool');

const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware.js');

// get submission by id
router.get('/:submissionId', (req, res) => {
  const queryText = `
    select
        id,
        user_id,
        form_id,
        started_at,
        finished_at,
        COALESCE( (select
            json_agg(
                json_build_object(
                'question', (select
                    json_agg(
                        json_build_object(
                            'id', question.id,
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
                'question_id', answer.question_id,
                'answer', answer.answer,
                'answer_id', answer.id
                )
            )
            from answer
            where answer.submission_id = submission.id
        ), '[]'::json) as answers
    from submission
    where id = $1;
    `;
  pool
    .query(queryText, [req.params.submissionId])
    .then((response) => {
      res.send(response.rows[0]);
    })
    .catch((err) => {
      console.error('Error grabbing submission by id', err);
      res.send(500);
    });
});

// deletes submission by id. Answers get cascade deleted upon submission deletion.
router.delete('/:submissionId', (req, res) => {
  const queryText = `
        delete from submission where id = $1;
    `;
  pool
    .query(queryText, [req.params.submissionId])
    .then((reponse) => {
      res.send(201);
    })
    .catch((err) => {
      console.error('Error deleting submission', err);
      res.send(500);
    });
});

router.put('/:submissionId/update', async (req, res) => {
  // req.body: {answers: [{answer, question_id, answer_id}] is all we need
  if (!req.body.answers || typeof req.body.answers?.length !== typeof 0) {
    res.status(400).send({ message: 'answers key is required' });
    return;
  }
  try {
    for (const answer of req.body.answers) {
      // See if answer has already been submitted for this submission
      if (answer.answer_id) {
        // UPDATE existing answer id
        await pool.query(`UPDATE "answer" SET answer=$1 WHERE id=$2`, [answer.answer, answer.answer_id]);
      } else {
        // INSERT
        await pool.query(
          `
                INSERT into "answer" ("question_id", "user_id", "submission_id", "answer")
                VALUES ($1, $2, $3, $4);`,
          [answer.question_id, req.user.id, req.params.submissionId, answer.answer]
        );
      }
    }
    res.status(201).send({ message: `Processed ${req.body.answers.length} answers` });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// Put for submission. Saves progress.
// router.put('/', async (req, res) => {
//     const OldSubmission = req.body.OldSubmission;
//     const NewSubmission = req.body.NewSubmission;
//     const oldAnswerIds = [];
//     for (let i = 0; i < OldSubmission.answers.length; i++) {
//         oldAnswerIds.push(OldSubmission.answers[i].answer_id);
//     }

//     // I could just do a 'delete where submission id = req.params' but I need to do the delete second to ensure the safety of the data.
//     const clearQuery = `
//         delete from answer
//         where id in ( 0, ${oldAnswerIds.join(', ')});
//     `;

//     // TODO: This is incomplete
//     const addQuery = `
//         insert into answer ( "submission_id", "question_id", "user_id", "answer")
//         values
//     `;
//     let sanitizedAnswers = [];
//     let sanitizedAnswersTracker = 1;
//     for (let i = 0; i < NewSubmission.answers.length; i++) {
//         sanitizedAnswers.push(NewSubmission.answers[i].answer);
//         addQuery += `
//         ( ${NewSubmission.id}, ${NewSubmission.answers[i].question[0].question_Id}, ${req.user.id}, $${sanitizedAnswersTracker++})
//         `;
//         if (i < NewSubmission.answers.length - 1) {
//             addQuery += ',';
//         }
//     }
//     try {
//         await pool.query(addQuery, [...sanitizedAnswers]);
//         await pool.query(clearQuery);
//         res.send(200);
//     } catch (error) {
//         console.log('Error saving form progress.', err);
//         res.send(error).status(500);
//     }
// })

// Put for submission. Sets submission to finished.
router.put('/:submissionId/submit', async (req, res) => {
  try {
    const queryText = `
        update submission
        set finished_at = now()
        where id = $1 RETURNING *;
    `;
    const submissionResult = await pool.query(queryText, [req.params.submissionId]);
    
    // Get the pipeline_id and first pipeline_status_id for this form
    const pipelineQuery = `
        SELECT pipeline.id as pipeline_id, pipeline_status.id as status_id 
                    FROM forms
                    JOIN pipeline ON forms.default_pipeline_id = pipeline.id
                    JOIN pipeline_status ON pipeline.id = pipeline_status.pipeline_id
                    WHERE forms.id = $1 ORDER BY "pipeline_status"."order" ASC LIMIT 1;
        `;
    const pipelineResult = await pool.query(pipelineQuery, [submissionResult.rows[0].form_id]);

    // Insert the user's initial status into user_status
    const statusQuery = `
            INSERT INTO user_status (user_id, pipeline_status_id)
            VALUES ($1, $2);`;
    await pool.query(statusQuery, [req.user.id, pipelineResult.rows[0].status_id]);
    res.send(200);
  } catch (err) {
    console.error('Error submitting submission.', err);
    res.send(500);
  }
});
// Post for new submission
router.post('/', rejectUnauthenticated, async (req, res) => {
  if (!req.body.form_id) {
    res.sendStatus(400);
    return;
  }
  console.log(req.user.id, req.body);

  // check to see if form already has been started by this user
  // but not already submitted
  try {
    const queryText = `
            select * from submission where 
            user_id=$1 AND form_id=$2 AND finished_at is null;
        `;
    const { rows } = await pool.query(queryText, [req.user.id, req.body.form_id]);
    console.log(`rows:`, rows);
    if (rows.length > 0) {
      // continue the existing submission
      res.send(rows[0]);
      return;
    }

    // start a fresh submission on this form
    const queryText2 = `
            insert into submission ( user_id, form_id, started_at)
            values ( $1, $2, now()) returning *;
        `;
    const result = await pool.query(queryText2, [req.user.id, req.body.form_id]);
    res.send(result.rows[0]);
  } catch (err) {
    console.error('Error posting new submission', err);
    res.send(err).status(500);
  }
});

module.exports = router;
