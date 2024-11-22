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
 *  archive questions
 * 
 * Submission
 * Post Submissions + answers in the submission
 */

router.get('/', (req, res) => {
    pool.query(`select * from forms;`).then(response => {
        res.send(response.rows).status(200);
    }).catch(err => {
        console.error('Error getting forms', err);
        res.send(500);
    })
})

// gets a single form with all the sections, quesetions, etc.
// (useful on the frontend)
router.get('/:formId/all', (req, res) => {
    const queryText = `
select 
	'Form' as "type",
	forms.id as "id",
	forms."name" as "name",
	forms."default_pipeline_id" as "pipeline_id",
	forms."location_id" as "location_id",
	(select
		json_agg(
			json_build_object(
				'type', 'Section',
				'id', sections.id,
				'order', sections."order",
                'name', sections."name",
				'description', sections.description,
				'questions', (select 
					json_agg(
						json_build_object(
							'type', 'Question',
							'id', question.id,
							'question', question.question,
							'description', question.description,
							'order', question."order",
							'answer_type', question.answer_type,
							'required', question.required,
							'multiple_choice_answers', (select 
								json_agg(
									json_build_object(
										'type', 'MCAnswer',
										'id', multiple_choice_answers.id,
										'answer', multiple_choice_answers.answer
									)
								)
								from multiple_choice_answers
								where multiple_choice_answers.question_id = question.id
							)
						)
					) from question
					where question.section_id = sections.id
                    and question.archived = false
				)
			)
		) from sections
		where sections.form_id = forms.id
	) as "sections"
from forms
where forms.id = $1
group by forms.id;
    `
    pool.query(queryText,[req.params.formId]).then(response => {
        res.send(response.rows[0]);
    }).catch(err => {
        console.error('Error grabbing the form', err);
        res.send(500);
    })
})

// creates a new form with pipeline id
router.post('/', (req, res) => {
    const queryText = `
        insert into forms("name", default_pipeline_id, location_id)
        values($1, $2, $3);
    `
    pool.query(queryText, [req.body.name, req.body.default_pipeline_id, req.body.location_id]).then(response => {
        res.send(200);
    }).catch(err => {
        console.error('Error posting form', err);
        res.send(500);
    })
});

// EDIT form by id (name, pipeline id)

// DELETE form by id
router.delete('/:formId', (req, res) => {
    const queryText = `
        DELETE FROM forms
        WHERE id = $1;
    `
    pool.query(queryText, [req.params.formId])
        .then(response => {
            res.sendStatus(200);
        })
        .catch(err => {
            console.error('Error deleting form', err);
            res.sendStatus(500);
        });
});

// Form edit route


// big fancy form edit route that I want to do
// PUT route to edit a form by ID with sections, questions, and multiple choice answers management
// router.put('/api/forms/:id', async (req, res) => {
//     const formId = parseInt(req.params.id);
//     const { name, pipeline_id, sections } = req.body;

//     // Validate input
//     if (!name && !pipeline_id && !sections) {
//         return res.status(400).json({ error: 'No fields to update' });
//     }

//     const client = await pool.connect();
//     try {
//         await client.query('BEGIN'); // Start a transaction

//         // Step 1: Update form fields if necessary
//         const updates = [];
//         const values = [];
//         let index = 1;

//         if (name) {
//             updates.push(`name = $${index++}`);
//             values.push(name);
//         }
//         if (pipeline_id !== undefined) {
//             updates.push(`pipeline_id = $${index++}`);
//             values.push(pipeline_id);
//         }
//         values.push(formId);

//         if (updates.length > 0) {
//             const query = `
//                 UPDATE forms
//                 SET ${updates.join(', ')}
//                 WHERE id = $${index}
//             `;
//             await client.query(query, values);
//         }

//         // Prepare bulk operations for sections, questions, and multiple choice answers
//         const sectionUpdates = [];
//         const sectionInserts = [];
//         const sectionDeletions = [];
//         const questionUpdates = [];
//         const questionInserts = [];
//         const multipleChoiceUpdates = [];
//         const multipleChoiceInserts = [];
//         const multipleChoiceDeletions = [];

//         // Step 2: Manage sections and questions
//         const existingSectionIds = new Set(); // To track existing section IDs

//         for (const section of sections) {
//             const { id: sectionId, name: sectionName, description, order, questions, deleteSection } = section;

//             // Check for deletion of section
//             if (deleteSection) {
//                 sectionDeletions.push(sectionId);
//             } else {
//                 existingSectionIds.add(sectionId); // Track section IDs being updated/added

//                 // Add or Update Section
//                 if (sectionId) {
//                     // Update existing section
//                     sectionUpdates.push(`(${sectionId}, '${sectionName}', '${description}', ${formId}, ${order})`);
//                 } else {
//                     // Prepare for inserting new section
//                     sectionInserts.push(`('${sectionName}', '${description}', ${formId}, ${order})`);
//                 }

//                 // Step 3: Manage questions
//                 if (questions) {
//                     for (const question of questions) {
//                         const { id: questionId, questionText, description, answer_type, order, archived, multipleChoiceAnswers } = question;

//                         // Prepare update for question
//                         if (questionId) {
//                             // Update existing question
//                             questionUpdates.push(`(${questionId}, '${questionText}', '${description}', '${answer_type}', ${order}, ${archived ? 'true' : 'false'})`);

//                             // Manage multiple choice answers
//                             if (multipleChoiceAnswers) {
//                                 for (const answer of multipleChoiceAnswers) {
//                                     const { id: answerId, answerText, deleteAnswer } = answer;

//                                     if (deleteAnswer) {
//                                         multipleChoiceDeletions.push(answerId);
//                                     } else if (answerId) {
//                                         // Update existing multiple choice answer
//                                         multipleChoiceUpdates.push(`(${answerId}, '${answerText}')`);
//                                     } else {
//                                         // Prepare for inserting new multiple choice answer
//                                         multipleChoiceInserts.push(`('${answerText}', ${questionId})`);
//                                     }
//                                 }
//                             }
//                         } else {
//                             // Prepare for inserting new question
//                             questionInserts.push(`('${questionText}', '${description}', '${answer_type}', ${order}, ${sectionId})`);
//                         }
//                     }
//                 }
//             }
//         }

//         // Step 4: Execute bulk updates and inserts for sections
//         if (sectionUpdates.length > 0) {
//             await client.query(`
//                 UPDATE sections
//                 SET name = s.name, description = s.description, order = s.order
//                 FROM (VALUES ${sectionUpdates.join(', ')}) AS s(id, name, description, form_id, order)
//                 WHERE sections.id = s.id;
//             `);
//         }

//         if (sectionInserts.length > 0) {
//             await client.query(`
//                 INSERT INTO sections (name, description, form_id, order)
//                 VALUES ${sectionInserts.join(', ')}
//             `);
//         }

//         // Step 5: Delete sections if any
//         if (sectionDeletions.length > 0) {
//             const deletionQuery = `
//                 DELETE FROM sections
//                 WHERE id IN (${sectionDeletions.join(', ')})
//             `;
//             await client.query(deletionQuery);
//         }

//         // Step 6: Update and archive questions
//         if (questionUpdates.length > 0) {
//             await client.query(`
//                 UPDATE question
//                 SET question = q.question, description = q.description, answer_type = q.answer_type, order = q.order, archived = q.archived
//                 FROM (VALUES ${questionUpdates.join(', ')}) AS q(id, question, description, answer_type, order, archived)
//                 WHERE question.id = q.id;
//             `);
//         }

//         if (questionInserts.length > 0) {
//             await client.query(`
//                 INSERT INTO question (question, description, answer_type, order, section_id)
//                 VALUES ${questionInserts.join(', ')}
//             `);
//         }

//         // Step 7: Update multiple choice answers
//         if (multipleChoiceUpdates.length > 0) {
//             await client.query(`
//                 UPDATE multiple_choice_answers
//                 SET answer = m.answer
//                 FROM (VALUES ${multipleChoiceUpdates.join(', ')}) AS m(id, answer)
//                 WHERE multiple_choice_answers.id = m.id;
//             `);
//         }

//         if (multipleChoiceInserts.length > 0) {
//             await client.query(`
//                 INSERT INTO multiple_choice_answers (answer, question_id)
//                 VALUES ${multipleChoiceInserts.join(', ')}
//             `);
//         }

//         // Step 8: Delete multiple choice answers if any
//         if (multipleChoiceDeletions.length > 0) {
//             const deletionQuery = `
//                 DELETE FROM multiple_choice_answers
//                 WHERE id IN (${multipleChoiceDeletions.join(', ')})
//             `;
//             await client.query(deletionQuery);
//         }

//         await client.query('COMMIT'); // Commit the transaction
//         res.status(200).json({ message: 'Form updated successfully' });
//     } catch (error) {
//         await client.query('ROLLBACK'); // Rollback the transaction on error
//         console.error('Error updating form, sections, questions, or multiple choice answers:', error);
//         res.status(500).json({ error: 'Database error' });
//     } finally {
//         client.release(); // Release the client back to the pool
//     }
// });


module.exports = router;
