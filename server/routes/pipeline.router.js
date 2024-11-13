/**
 * I highly recommend splitting this file into multiple files as it's going to get very long having pipeline, status, and user status in the same file and CRUD for each. 
 * 
 * Generally, each 'asset' you should have a different router file. (i.e. pipeline, pipeline status, user pipeline status)
 * 
 * It's also common practice to name your routes similar to the table names in the database. (i.e. /api/pipeline, /api/pipeline_status, /api/user_pipeline_status)
 * 
 */
const express = require('express');
const pool = require('../modules/pool');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');

const router = express.Router();

/**
 * @swagger
 * paths:
 *   /api/pipeline:
 *     post:
 *       summary: Create a new pipeline
 *       description: Creates a new pipeline with the provided name.
 *       tags:
 *         - Pipeline
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: The name of the pipeline.
 *                   example: "DonorPipeline"
 *               required:
 *                 - name
 *       responses:
 *         '201':
 *           description: Pipeline created successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Pipeline created successfully."
 *         '400':
 *           description: Bad request - invalid input.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Invalid name provided."
 *
 */
router.post('/', rejectUnauthenticated, (req, res) => {
  // TODO: Add chapter id to the pipeline table based on the logged in user's chapter. 
  const newLogQuery = `
  INSERT INTO "pipeline" 
    ("name")
    VALUES ($1);
  `;
  pool
    .query(newLogQuery, [req.body.name])
    .then((results) => {
      console.log('Pipeline name POSTed');
      res.sendStatus(201);
    })
    .catch((error) => {
      console.log('error in POST on pipeline', error);
      res.sendStatus(400);
    });
});

/**
 * @swagger
 * /api/pipeline/status:
 *   post:
 *     summary: Create a new pipeline status
 *     description: Inserts a new pipeline status record into the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pipeline_id:
 *                 type: integer
 *                 description: The ID of the pipeline.
 *                 example: 1
 *               order:
 *                 type: integer
 *                 description: The order of the pipeline.
 *                 example: 1
 *               name:
 *                 type: string
 *                 description: The name of the pipeline status.
 *                 example: "In Progress"
 *             required:
 *               - pipeline_id
 *               - order
 *               - name
 *     responses:
 *       '201':
 *         description: Pipeline status successfully created
 *       '401':
 *         description: Unauthorized
 */
router.post('/status', rejectUnauthenticated, (req, res) => {
  const newLogQuery = `
  INSERT INTO "pipeline_status" 
    ("pipeline_id", "order", "name")
    VALUES ($1, $2, $3);
  `;
  pool
    .query(newLogQuery, [req.body.pipeline_id, req.body.order, req.body.name])
    .then((results) => {
      console.log('Pipeline status POSTed');
      res.sendStatus(201);
    })
    .catch((error) => {
      console.log('error in POST on pipeline status', error);
      res.sendStatus(500);
    });
});

/**
 * @swagger
 * /api/pipeline/userstatus:
 *   post:
 *     summary: Create a new user status
 *     description: Inserts a new user status record into the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *                 description: The ID of the user.
 *                 example: 456
 *               p_s_id:
 *                 type: integer
 *                 description: The ID of the pipeline status.
 *                 example: 123
 *             required:
 *               - user_id
 *               - p_s_id
 *     responses:
 *       '201':
 *         description: User status successfully created
 *       '500':
 *         description: Internal server error
 */
router.post('/userstatus', rejectUnauthenticated, (req, res) => {
    console.log("req.body", req.body)
  // I'd recommend using the column name pipeline_status_id instead of p_s_id -> it's more readable and will be easier for other developers to understand when picking up the project later.
  const newLogQuery = `
  INSERT INTO "user_status" 
    ("user_id", "p_s_id")
    VALUES ($1, $2);
  `;
  pool
    .query(newLogQuery, [req.body.user_id, req.body.p_s_id])
    .then((results) => {
      console.log('User status POSTed');
      res.sendStatus(201);
    })
    .catch((error) => {
      console.log('error in POST on user status', error);
      res.sendStatus(500);
    });
});
/*
 * Will need a get by pipeline id
 * Will need a get pipeline uses by id
 * will need to update pipelines and statuses
 * will need to update user statuses
 * will need to post user statuses
 *
 */

module.exports = router;
