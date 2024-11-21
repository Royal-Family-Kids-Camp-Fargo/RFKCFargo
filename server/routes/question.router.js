const express = require('express');
const pool = require('../modules/pool');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const router = express.Router();

/**
 * @swagger
 * /api/question/{sectionId}:
 *   get:
 *     summary: Get questions by section ID
 *     tags: [questions]
 *     parameters:
 *       - name: sectionId
 *         in: path
 *         required: true
 *         description: The ID of the section to retrieve questions for
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: List of questions with their multiple choice options
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   question:
 *                     type: string
 *                   description:
 *                     type: string
 *                   answer_type:
 *                     type: string
 *                   order:
 *                     type: integer
 *                   required:
 *                     type: boolean
 *                   multiple_choice_options:
 *                     type: array
 *                     items:
 *                       type: object
 *       '500':
 *         description: Internal server error
 */
router.get('/:sectionId', rejectUnauthenticated, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT q.*, json_agg(mca.*) as multiple_choice_options
      FROM question q
      LEFT JOIN multiple_choice_answers mca ON q.id = mca.question_id
      WHERE q.section_id = $1 AND q.archived = false
      GROUP BY q.id
      ORDER BY q.order;
    `, [req.params.sectionId]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error in GET questions:', err);
    res.sendStatus(500);
  }
});

/**
 * @swagger
 * /api/question:
 *   post:
 *     summary: Create a new question
 *     tags: [questions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *               description:
 *                 type: string
 *               answer_type:
 *                 type: string
 *               order:
 *                 type: integer
 *               section_id:
 *                 type: integer
 *               required:
 *                 type: boolean
 *               multiple_choice_options:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       '201':
 *         description: Question created successfully
 *       '500':
 *         description: Internal server error
 */
router.post('/', rejectUnauthenticated, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const questionResult = await client.query(`
      INSERT INTO question (question, description, answer_type, order, section_id, required)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id;
    `, [req.body.question, req.body.description, req.body.answer_type, 
        req.body.order, req.body.section_id, req.body.required]);
    
    if (req.body.multiple_choice_options?.length > 0) {
      const questionId = questionResult.rows[0].id;
      for (const option of req.body.multiple_choice_options) {
        await client.query(`
          INSERT INTO multiple_choice_answers (question_id, answer)
          VALUES ($1, $2);
        `, [questionId, option]);
      }
    }

    await client.query('COMMIT');
    res.sendStatus(201);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error in POST question:', err);
    res.sendStatus(500);
  } finally {
    client.release();
  }
});

/**
 * @swagger
 * /api/question/{id}:
 *   put:
 *     summary: Update an existing question
 *     tags: [questions]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Question ID to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *               description:
 *                 type: string
 *               answer_type:
 *                 type: string
 *               order:
 *                 type: integer
 *               required:
 *                 type: boolean
 *               multiple_choice_options:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       '200':
 *         description: Question updated successfully
 *       '500':
 *         description: Internal server error
 */
router.put('/:id', rejectUnauthenticated, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    await client.query(`
      UPDATE "question" 
      SET question = $1, description = $2, answer_type = $3, 
          "order" = $4, required = $5, updated_at = NOW()
      WHERE id = $6;
    `, [req.body.question, req.body.description, req.body.answer_type,
        req.body.order, req.body.required, req.params.id]);
    
    if (req.body.multiple_choice_options) {
      await client.query('DELETE FROM multiple_choice_answers WHERE question_id = $1', 
        [req.params.id]);
      
      for (const option of req.body.multiple_choice_options) {
        await client.query(`
          INSERT INTO multiple_choice_answers (question_id, answer)
          VALUES ($1, $2);
        `, [req.params.id, option]);
      }
    }

    await client.query('COMMIT');
    res.sendStatus(200);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error in PUT question:', err);
    res.sendStatus(500);
  } finally {
    client.release();
  }
});

/**
 * @swagger
 * /api/question/{id}/archive:
 *   put:
 *     summary: Archive a question (soft delete)
 *     tags: [questions]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Question ID to archive
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Question archived successfully
 *       '500':
 *         description: Internal server error
 */
router.put('/:id/archive', rejectUnauthenticated, async (req, res) => {
  try {
    await pool.query(`
      UPDATE question 
      SET archived = true, updated_at = NOW()
      WHERE id = $1;
    `, [req.params.id]);
    res.sendStatus(200);
  } catch (err) {
    console.error('Error in archive question:', err);
    res.sendStatus(500);
  }
});

module.exports = router;