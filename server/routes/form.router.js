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

router.get('/', (req, res) => {
    pool.query(`select * from forms;`).then(response => {
        res.send(response.rows).status(200);
    }).catch(err => {
        console.error('Error getting forms', err);
        res.send(500);
    })
})

router.get('/:formId/all', (req, res) => {
    const queryText = `
select 
	'Form' as "type",
	forms.id as "id",
	forms."name" as "name",
	(select
		json_agg(
			json_build_object(
				'type', 'Section',
				'id', sections.id,
				'order', sections."order",
				'description', sections.description,
				'questions', (select 
					json_agg(
						json_build_object(
							'type', 'Question',
							'question', question.question,
							'description', question.description,
							'order', question."order",
							'answer_type', question.answer_type,
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

router.put('/:formId', (req, res) => {
    const OldForm = req.body.OldForm;
    const NewForm = req.body.NewForm;
    const sectionIds = [];
    const questionIds = [];
    const multipleChoiceAnswerIds = [];

    function idFinder(object){
        const type = object.type;
        if(type === 'Form'){
            idFinder(object.sections)
        } else if (type === 'Section'){
            object
        }
    }

})

module.exports = router;