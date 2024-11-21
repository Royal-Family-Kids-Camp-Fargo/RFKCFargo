const express = require('express');
const pool = require('../modules/pool');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');

const router = express.Router();

// constant array for the volunteer pipeline type
const PIPELINE_STATUS_VOLUNTEER = [
  { order: 1, name: 'application submitted' },
  { order: 2, name: 'application review' },
  { order: 3, name: 'interview' },
  { order: 4, name: 'background check' },
  { order: 5, name: 'verified/accepted' },
];

// constant array for the donor pipeline type
const PIPELINE_STATUS_DONOR = [
  { order: 1, name: 'interested' },
  { order: 2, name: 'discussed' },
  { order: 3, name: 'check sent' },
  { order: 4, name: 'check verified' },
  { order: 5, name: 'donated' },
];

//
// FUSSY SEARCH
//

router.get('/search', (req, res) => {
  const searchTerm = req.query.term;
  const sqlQuery = `
  SELECT 
    "username", 
    "first_name", 
    "last_name",
    "id",
    GREATEST(
        similarity("first_name", $1),
        similarity("last_name", $1),
        similarity(CONCAT("first_name", ' ', "last_name"), $1)
    ) AS similarity_score
FROM "user"
WHERE 
    similarity("first_name", $1) > 0.2
    OR similarity("last_name", $1) > 0.2
    OR similarity(CONCAT("first_name", ' ', "last_name"), $1) > 0.2
ORDER BY similarity_score DESC;
  `;

  pool
    .query(sqlQuery, [searchTerm])
    .then((result) => {
      if (result.rows.length === 0) {
        return res.status(404).send('No matching users found');
      }
      res.send(result.rows);
    })
    .catch((error) => {
      console.error('Error executing fuzzy search query:', error);
      res.status(500).send('Internal Server Error');
    });
});
//
// END FUSSY SEARCH
//

//
//PIPELINE
//
/**
 * @swagger
 * /api/pipeline:
 *   get:
 *     summary: Get a list of all pipelines
 *     description: Fetches a list of all pipeline names.
 *     responses:
 *       '200':
 *         description: Successfully fetched the list of pipelines.
 *         tags:
 *          - Pipeline
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: The name of the pipeline.
 *                     example: "Volunteer Pipeline"
 *       '500':
 *         description: Internal Server Error (failure to fetch data from the database).
 */
router.get('/', (req, res) => {
  const sqlQuery = `
     SELECT 
     "id", "name"
     FROM
     "pipeline"
  `;
  pool
    .query(sqlQuery)
    .then((result) => {
      res.json(result.rows);
    })
    .catch((error) => {
      console.error('Error fetching list of pipelines:', error);
      res.sendStatus(500);
    });
});

///   will add location column later on so that internal users at a specific location can only edit pipelines for their location
router.get('/:pipelineId', (req, res) => {
  const pipelineId = req.params.pipelineId; //for example, the Volunteer_fargo pipeline Id
  const sqlQuery = `

SELECT 
    json_build_object(
        'pipeline_id', "pipeline"."id",
        'pipeline_name', "pipeline"."name", 
        'statuses', (
            SELECT json_agg(status_ordered)
            FROM (
                SELECT 
                    json_build_object(
                        'pipeline_status_id', "pipeline_status"."id",
                        'status', "pipeline_status"."name",
                        'order', "pipeline_status"."order",
                        'applicants', (
                            SELECT json_agg(
                                json_build_object(
                                    'user_firstName', "user"."first_name",
                                    'user_lastName', "user"."last_name",
                                    'id', "user"."id",
                                    'username', "user"."username",
                                    'pipeline_status_id', "pipeline_status"."id",
                                    'status', "pipeline_status"."name",
                                    'order', "pipeline_status"."order",
                                    'phoneNumber', "user"."phone_number"
                                )
                            )
                            FROM "user"
                            JOIN "user_status" ON "user_status"."user_id" = "user"."id"
                            WHERE "user_status"."pipeline_status_id" = "pipeline_status"."id"
                        )
                    ) AS status_ordered
                FROM "pipeline_status"
                WHERE "pipeline_status"."pipeline_id" = "pipeline"."id"
                ORDER BY "pipeline_status"."order"
            ) AS ordered_statuses
        )
    ) AS pipeline
FROM 
    "pipeline"
WHERE 
    "pipeline"."id" = $1;

`;

  //   const sqlQuery = `
  // SELECT
  //     json_build_object(
  //         'pipeline_id', "pipeline"."id",
  //         'pipeline_name', "pipeline"."name",
  //         'statuses', (
  //             SELECT json_agg(
  //                 json_build_object(
  //                     'pipeline_status_id', "pipeline_status"."id",
  //                     'status', "pipeline_status"."name",
  //                     'order', "pipeline_status"."order",
  //                     'applicants', (
  //                         SELECT json_agg(
  //                             json_build_object(
  //                                 'user_firstName', "user"."first_name",
  //                                 'id', "user"."id",
  //                                 'username', "user"."username",
  //                                 'pipeline_status_id', "pipeline_status"."id",
  //                                 'status', "pipeline_status"."name",
  //                                 'order', "pipeline_status"."order"
  //                             )
  //                         )
  //                         FROM "user"
  //                         JOIN "user_status" ON "user_status"."user_id" = "user"."id"
  //                         WHERE "user_status"."pipeline_status_id" = "pipeline_status"."id"

  //                     )
  //                 )
  //             )
  //             FROM "pipeline_status"
  //             WHERE "pipeline_status"."pipeline_id" = "pipeline"."id"
  //             ORDER BY "pipeline_status"."order"

  //         )
  //     ) AS pipeline
  // FROM
  //     "pipeline"
  // WHERE
  //     "pipeline"."id" = $1;

  // `;

  pool
    .query(sqlQuery, [pipelineId])
    .then((result) => {
      console.log('query result', result.rows[0].pipeline);
      res.send(result.rows[0].pipeline);
    })
    .catch((error) => {
      console.error('Error fetching Kanban data:', error);
      res.sendStatus(500);
    });
});
/* THIS IS THE STRUTURE for the pipeline by Id
{ //this object is the entire pipeline, ie, for a site such as Sioux Falls
    pipeline_name: "Volunteer_fargo", // in our DB has an id of 1
    statuses:[ // this key contains the array of swimlane objects
        { // this object describes the swim lane
            status: "Interview", 
            applicants: 
              [
                { // this object describes the individual
                    user_firstName:"Jenny"
                    id: 1
                    username: "jenny@email.com"
                },
                { user_firstName: "Bobby",
                 id: 2,
                 username: "bobby@email.com"
                }
              ]
        },
        {status: "Application Review"
            applicants:
            [ 
              {
                user_firstName: "Jill"
                id:6
                username:jill@email.com
            }
            {
                user_firstName:"Jack"
                id: 7
                username:jack@email.com
            }
        {status: "Application Submitted"
            applicants:
            [ 
              {
                user_firstName: "John"
                id:3
                username:john@email.com
            }
            {
                user_firstName:"Jane"
                id: 7
                username:jane@email.com
            }
 
                
            ]
        }
    ] // end of statusus array
} //end of pipeline object
    
*/
// swim lanes: 1.Application Submitted, 2.Application Review, 3.Interview, 4.Background Check 5. Verified/Accepted
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
// for future: add a reference column to location table
router.post('/', rejectUnauthenticated, (req, res) => {
  const pipelineType = req.body.type;
  const pipelineName = req.body.name;
  // FIRST QUERY creates the pipeline
  // protect the insert from bad data, or not in allowed list of pipeline types
  if (!pipelineType || !['volunteer', 'donor'].includes(pipelineType)) {
    res.send(400);
    return;
  } else {
    const newLogQuery = `
    INSERT INTO "pipeline" 
    ("name", "type")
    VALUES ($1, $2) RETURNING id;
  `;
    // will need to use the NEW pipeline id to insert new records into the pipeline_status
    // const volunteer = [{order: 1, name: 'application submitted}, {...the other status go here}];
    pool
      .query(newLogQuery, [pipelineName, pipelineType])
      .then((results) => {
        console.log('Pipeline name POSTed');
        const newPipelineId = results.rows[0].id;

        // SECOND QUERY to create inserts to pipeline_status w/ the newPipelineId
        // need to check the pipelineType, to ensure the correct constant array is used
        // example, if (pipelineType === 'volunteer') {...need a loop to go through the PIPELINE_STATUS...}
        // need queryString and another pool
        const newPipeLineStatusQuery = `
          INSERT INTO "pipeline_status" 
          ("pipeline_id", "order", "name")
          VALUES ($1, $2, $3);
          `;
        // which workflow do we use, check the pipeline type
        if (pipelineType === 'volunteer') {
          // loop my volunteer constant array (top of file)
          PIPELINE_STATUS_VOLUNTEER.forEach((status) => {
            pool.query(newPipeLineStatusQuery, [newPipelineId, status.order, status.name]).catch((error) => {
              console.log('Error inserting pipeline status for volunteer', error);
            });
          });
        } else if (pipelineType === 'donor') {
          PIPELINE_STATUS_DONOR.forEach((status) => {
            pool.query(newPipeLineStatusQuery, [newPipelineId, status.order, status.name]).catch((error) => {
              console.log('Error inserting pipeline status for donor', error);
            });
          });
        } else {
          res.send(400);
          return;
        }

        res.sendStatus(201);
      })
      .catch((error) => {
        console.log('error in POST on pipeline', error);
        res.sendStatus(400);
      });
  }
});

/**
 * @swagger
 * api/pipeline/{id}:
 *   delete:
 *     summary: Delete a pipeline by ID
 *     description: Deletes a pipeline from the database based on the provided ID.
 *     tags:
 *         - Pipeline
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the pipeline to delete.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '204':
 *         description: Successfully deleted the pipeline, no content returned.
 *       '404':
 *         description: Pipeline with the given ID not found.
 */

router.delete('/:id', rejectUnauthenticated, (req, res) => {
  let pipelineId = req.params.id;
  let sqlQuery = 'DELETE FROM "pipeline" WHERE id=$1;';
  pool
    .query(sqlQuery, [pipelineId])
    .then((result) => {
      console.log(`Pipeline with ID ${pipelineId} deleted successfully`);
      res.sendStatus(204);
    })
    .catch((error) => {
      console.log(`Error deleting pipeline ${sqlQuery}`, error);
      res.sendStatus(500);
    });
});

//
//PIPELINE STATUS
//

/**
 * @swagger
 * /api/pipeline/pipeline_status:
 *   post:
 *     summary: Create a new pipeline status
 *     description: Inserts a new pipeline status record into the database.
 *     tags:
 *       - Pipeline
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
router.post('/pipeline_status', rejectUnauthenticated, (req, res) => {
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
 * api/pipeline_status/{id}:
 *   delete:
 *     summary: Delete a pipeline status
 *     description: Deletes a pipeline status by its ID. If the pipeline status has related entries in other tables (e.g., user_status), they will be deleted automatically due to the cascade delete rule in the database.
 *     tags:
 *       - Pipeline
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the pipeline status to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Successfully deleted the pipeline status.
 *       500:
 *         description: Internal server error. Something went wrong while processing the delete request.
 */
router.delete('/pipeline_status/:id', rejectUnauthenticated, (req, res) => {
  let pipelineStatusId = req.params.id;
  let sqlQuery = 'DELETE FROM "pipeline_status" WHERE id=$1;';
  pool
    .query(sqlQuery, [pipelineStatusId])
    .then((result) => {
      console.log(`Pipeline status with ID ${pipelineStatusId} deleted successfully`);
      res.sendStatus(204);
    })
    .catch((error) => {
      console.log(`Error deleting pipeline status ${sqlQuery}`, error);
      res.sendStatus(500);
    });
});
/**
 * @swagger
 * api/pipeline_status/{id}:
 *   put:
 *     summary: Update a pipeline status name and order
 *     description: Updates both the name and order of the pipeline status identified by the given ID.
 *     tags:
 *       - Pipeline
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the pipeline status to update.
 *         schema:
 *           type: integer
 *       - in: body
 *         name: pipeline_status
 *         description: The new name and order for the pipeline status.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               description: The new name of the pipeline status.
 *             order:
 *               type: integer
 *               description: The new order of the pipeline status.
 *     responses:
 *       200:
 *         description: Successfully updated the pipeline status.
 *       500:
 *         description: Internal server error. Something went wrong while processing the update request.
 */
router.put('/pipeline_status/:id', rejectUnauthenticated, (req, res) => {
  let pipelineStatusId = req.params.id;
  let pipelineStatusOrder = req.body.order;
  let pipelineStatusName = req.body.name;
  let sqlQuery = `UPDATE "pipeline_status" SET "order"=$1, "name"=$2 WHERE "id"= $3;`;
  pool
    .query(sqlQuery, [pipelineStatusId, pipelineStatusOrder, pipelineStatusName])
    .then((result) => {
      console.log(`Pipeline with ID ${pipelineStatusId} name updated successfully`);
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log(`Error updating pipeline name for ID ${pipelineStatusId}:`, error);
      res.sendStatus(500);
    });
});

//
// USER STATUS
//
/**
 * @swagger
 * /api/pipeline/userstatus:
 *   post:
 *     summary: Create a new user status
 *     description: Inserts a new user status record into the database.
 *     tags:
 *       - Pipeline
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
router.post('/user_status', rejectUnauthenticated, (req, res) => {
  const newLogQuery = `
  INSERT INTO "user_status" 
    ("user_id", "pipeline_status_id")
    VALUES ($1, $2);
  `;
  pool
    .query(newLogQuery, [req.body.user_id, req.body.pipeline_status_id])
    .then((results) => {
      console.log(
        `User status created: User ID ${req.body.user_id} moved to Pipeline Status ID ${req.body.pipeline_status_id}`
      );
      res.sendStatus(201);
    })
    .catch((error) => {
      console.error(' Error creating user status for User ID', error);
      res.sendStatus(500);
    });
});
/**
 * @swagger
 * /api/pipeline/user_status/{userId}:
 *   put:
 *     summary: Update a user's pipeline status
 *     description: Updates the pipeline status of a user, based on the provided user ID and the new pipeline status ID.
 *     tags:
 *       - Pipeline
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: The ID of the user whose status is to be updated.
 *         required: true
 *         schema:
 *           type: integer
 *           example: 2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pipeline_status_id:
 *                 type: integer
 *                 description: The ID of the new pipeline status the user is being moved to.
 *                 example: 2
 *             required:
 *               - pipeline_status_id
 *     responses:
 *       '200':
 *         description: Successfully updated the user's pipeline status.
 *       '500':
 *         description: Internal Server Error (failure to update user status).
 */
router.put('/user_status', rejectUnauthenticated, (req, res) => {
  //we need to know
  //1. the pipeline id
  //2. the user to advance to next swim lane, ie jenny 'interview' -> 'background check'
  //3. know the next swimlane
  console.log('req body', req.body); // {user_id: 1, pipeline_status_id: 4}

  const updateUserStatusQuery = `
    UPDATE "user_status"
    SET "pipeline_status_id" = $1
    WHERE "user_id" = $2;
  `;

  pool
    .query(updateUserStatusQuery, [req.body.pipeline_status_id, req.body.user_id])
    .then(() => {
      console.log(`User ${req.body.user_id} moved to pipeline status ${req.body.pipeline_status_id}`);
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log('Error updating user status:', error);
      res.sendStatus(500);
    });
});
/**
 * @swagger
 * /api/pipeline/user_status/{userId}:
 *   delete:
 *     summary: Delete a user's pipeline status
 *     description: Deletes the pipeline status of a user based on the provided user ID.
 *     tags:
 *       - Pipeline
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: The ID of the user whose pipeline status is to be deleted.
 *         required: true
 *         schema:
 *           type: integer
 *           example: 2
 *     responses:
 *       '204':
 *         description: Successfully deleted the user's pipeline status.
 *       '500':
 *         description: Internal Server Error (failure to delete user status).
 */
router.delete('/user_status/:userId/:pipelineStatusId', rejectUnauthenticated, (req, res) => {
  const { userId, pipelineStatusId } = req.params;
  console.log('userId', userId);
  console.log('pipelineStatusId', pipelineStatusId);

  const deleteUserStatusQuery = `
    DELETE FROM "user_status"
    WHERE "user_id" = $1
    and "pipeline_status_id" = $2;
  `;
  pool
    .query(deleteUserStatusQuery, [userId, pipelineStatusId])
    .then(() => {
      console.log(`User status for User ID ${userId} has been deleted`);
      res.sendStatus(204);
    })
    .catch((error) => {
      console.error('Error deleting user status:', error);
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

/**
 * @swagger
 * api/pipeline/{id}:
 *   put:
 *     summary: Update the name of a pipeline
 *     description: Updates the name of an existing pipeline identified by the pipeline ID.
 *     tags:
 *       - Pipeline
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the pipeline to update.
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: body
 *         name: name
 *         required: true
 *         description: The new name to update the pipeline with.
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               example: "Updated Pipeline Name"
 *     responses:
 *       '200':
 *         description: Successfully updated the pipeline name.
 *       '404':
 *         description: Pipeline with the given ID not found.
 *       '500':
 *         description: Internal server error while updating the pipeline.
 */
//

///pipeline

router.put('/:id', rejectUnauthenticated, (req, res) => {
  let pipelineId = req.params.id;
  let newPipelineName = req.body.name;
  let sqlQuery = `UPDATE "pipeline" SET "name"=$1 WHERE "id"= $2;`;
  pool
    .query(sqlQuery, [newPipelineName, pipelineId])
    .then((result) => {
      console.log(`Pipeline with ID ${pipelineId} name updated successfully`);
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log(`Error updating pipeline name for ID ${pipelineId}:`, error);
      res.sendStatus(500);
    });
});
//
// END PIPELINE
//

module.exports = router;
