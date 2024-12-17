const express = require('express');
const pool = require('../modules/pool');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const router = express.Router();

/**
 * @swagger
 * /api/section/{formId}:
 *   get:
 *     summary: Get all sections for a specific form
 *     tags: [sections]
 *     parameters:
 *       - name: formId
 *         in: path
 *         required: true
 *         description: ID of the form to retrieve sections for
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: List of sections ordered by their order field
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   form_id:
 *                     type: integer
 *                   order:
 *                     type: integer
 *       '500':
 *         description: Internal server error
 */
router.get('/:formId', rejectUnauthenticated, async (req, res) => {
  try {
    const query = `
      SELECT * FROM "sections" 
      WHERE "form_id" = $1 
      ORDER BY "order";
    `;
    const result = await pool.query(query, [req.params.formId]);
    res.send(result.rows);
  } catch (err) {
    console.error('Error in GET sections:', err);
    res.sendStatus(500);
  }
});

/**
 * @swagger
 * /api/section:
 *   post:
 *     summary: Create a new section
 *     tags: [sections]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - form_id
 *               - order
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               form_id:
 *                 type: integer
 *               order:
 *                 type: integer
 *     responses:
 *       '201':
 *         description: Section created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 form_id:
 *                   type: integer
 *                 order:
 *                   type: integer
 *       '500':
 *         description: Internal server error
 */
router.post('/', rejectUnauthenticated, async (req, res) => {
  const { name, description, form_id, order } = req.body;
  
  try {
    const query = `
      INSERT INTO "sections" ("name", "description", "form_id", "order")
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const result = await pool.query(query, [name, description, form_id, order]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error in POST section:', err);
    res.sendStatus(500);
  }
});

/**
 * @swagger
 * /api/section/{id}:
 *   put:
 *     summary: Update an existing section
 *     tags: [sections]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the section to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - order
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               order:
 *                 type: integer
 *     responses:
 *       '200':
 *         description: Section updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 form_id:
 *                   type: integer
 *                 order:
 *                   type: integer
 *       '404':
 *         description: Section not found
 *       '500':
 *         description: Internal server error
 */
router.put('/:id', rejectUnauthenticated, async (req, res) => {
  const { name, description, order } = req.body;
  
  try {
    const query = `
      UPDATE "sections"
      SET "name" = $1,
          "description" = $2,
          "order" = $3
      WHERE "id" = $4
      RETURNING *;
    `;
    const result = await pool.query(query, [name, description, order, req.params.id]);
    
    if (result.rows.length === 0) {
      return res.sendStatus(404);
    }
    res.send(result.rows[0]);
  } catch (err) {
    console.error('Error in PUT section:', err);
    res.sendStatus(500);
  }
});

/**
 * @swagger
 * /api/section/{id}:
 *   delete:
 *     summary: Delete a section
 *     tags: [sections]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the section to delete
 *         schema:
 *           type: integer
 *     responses:
 *       '204':
 *         description: Section deleted successfully
 *       '404':
 *         description: Section not found
 *       '500':
 *         description: Internal server error
 */
router.delete('/:id', rejectUnauthenticated, async (req, res) => {
  try {
    const query = `
      DELETE FROM "sections"
      WHERE "id" = $1
      RETURNING *;
    `;
    const result = await pool.query(query, [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.sendStatus(404);
    }
    res.sendStatus(204);
  } catch (err) {
    console.error('Error in DELETE section:', err);
    res.sendStatus(500);
  }
});

module.exports = router;