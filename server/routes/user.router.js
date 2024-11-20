/**
 * I'd recomment splitting this file into two files. One for sesssions and one for users.
 * Sessions should handle login, logout, and password reset.
 * Users should handle CRUD for users.
 */

const express = require('express');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');

const router = express.Router();

// If the request came from an authenticated user, this route
// sends back an object containing that user's information.
// Otherwise, it sends back an empty object to indicate there
// is not an active session.
/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Get the current authenticated user or an empty object if not authenticated
 *     tags: Session
 *     responses:
 *       200:
 *         description: Successfully retrieved user data if authenticated, or an empty object if not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   description: The authenticated user object; returns an empty object if the user is not authenticated
 *                 message:
 *                   type: string
 *                   description: A message providing context about the current session, e.g., "User not authenticated" if no active session exists
 *       400:
 *         description: Bad request, invalid request format or missing parameters
 *       401:
 *         description: Unauthorized, user is not authenticated (if no active session is found)
 *       404:
 *         description: Not found, in case the endpoint is incorrectly configured or the resource is not available
 */
router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(req.user);
  } else {
    res.send({});
  }
});

/**
 * @swagger
 * /api/user/:userId:
 *   get:
 *     summary: Get detailed user profile information by user ID
 *     description: Retrieves user profile details, including username, first name, last name, phone number, name of pipeline(s) user is on, status on that pipeline, and location(s) user is attached to.
 *     tags:
 *       - Users
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved user information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: User ID.
 *                 username:
 *                   type: string
 *                   description: Username of the user.
 *                 first_name:
 *                   type: string
 *                   description: First name of the user.
 *                 last_name:
 *                   type: string
 *                   description: Last name of the user.
 *                 phone_number:
 *                   type: string
 *                   description: User's phone number.
 *                 location_name:
 *                   type: string
 *                   description: Name of the location associated with the user.
 *                 pipeline_status_name:
 *                   type: string
 *                   description: Name of the user's pipeline status.
 *                 pipeline_name:
 *                   type: string
 *                   description: Name of the pipeline associated with the user's status.
 *       404:
 *         description: User not found or not in the chapter_user table.
 *       500:
 *         description: Server error while retrieving user information.
 */
router.get('/:userId', rejectUnauthenticated, (req, res) => {
  // TODO: Add a check to see if the user is in the chapter_user table for the logged in user. Return a 404 if the user is not found.
  const queryText = `
     SELECT "user"."id", "user"."username", "user"."first_name", "user"."last_name", "user"."phone_number", "location"."name" AS "location_name" , "pipeline_status"."name" AS "pipeline_status_name", "pipeline"."name" AS "pipeline_name" FROM "user" 
      JOIN "user_location" ON "user_location"."user_id" = "user"."id"
      JOIN "location" ON "location"."id" = "user_location"."location_id"
      JOIN "user_status" ON "user_status"."user_id" = "user"."id"
      JOIN "pipeline_status" ON "pipeline_status"."id"= "user_status"."pipeline_status_id"
      JOIN "pipeline" ON "pipeline"."id" = "pipeline_status"."pipeline_id"
     WHERE "user"."id" = $1;
  `;
  pool
    .query(queryText, [req.params.userId])
    .then((result) => {
      res.send(result.rows);
    })
    .catch((error) => {
      console.log(`Error fetching user by ID ${req.params.userId} in route GET /:userId:`, error);
      res.sendStatus(500);
    });
});

// Handles the logic for creating a new user.
// The password is hashed before being added to the database.
/**
 * @swagger
 * api/user/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user in the system by storing their username, hashed password, first name, last name, and phone number in the database.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: john@email.com
 *                 description: email of the user.
 *               password:
 *                 type: string
 *                 example: securepassword123
 *                 description: Plain text password to be hashed and stored.
 *               first_name:
 *                 type: string
 *                 example: John
 *                 description: First name of the user.
 *               last_name:
 *                 type: string
 *                 example: Doe
 *                 description: Last name of the user.
 *               phone_number:
 *                 type: string
 *                 example: "1234567890"
 *                 description: The user's phone number.
 *     responses:
 *       201:
 *         description: User successfully created.
 *       400:
 *         description: Bad request, invalid input.
 *       500:
 *         description: Server error during registration.
 */
router.post('/register', (req, res, next) => {
  const username = req.body.username;
  const hashedPassword = encryptLib.encryptPassword(req.body.password);
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const phone_number = req.body.phone_number;

  const sqlText = `
    INSERT INTO "user"
      ("username", "password", "first_name", "last_name", "phone_number")
      VALUES
      ($1, $2, $3, $4, $5);
  `;
  const sqlValues = [username, hashedPassword, first_name, last_name, phone_number];

  pool
    .query(sqlText, sqlValues)
    .then(() => {
      res.sendStatus(201);
    })
    .catch((dbErr) => {
      console.log('An unexpected error occurred while registering the user. error:', dbErr);
      res.sendStatus(500);
    });
});

// Handles the logic for logging in a user. When this route receives
// a request, it runs a middleware function that leverages the Passport
// library to instantiate a session if the request body's username and
// password are correct.
// You can find this middleware function in /server/strategies/user.strategy.js.

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Login a user
 *     tags: Session
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               username:
 *                 type: string
 *                 description: email of user
 *               password:
 *                 type: string
 *                 description: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 message:
 *                   type: string
 *                   description: error when logging in
 *       400:
 *         description: Invalid credentials
 */
router.post('/login', userStrategy.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

// Clear all server session information about this user:
/**
 * @swagger
 * /api/user/logout:
 *   post:
 *     summary: Logout a user
 *     description: Logs out the user by clearing their session.
 *     tags:
 *       - Session
 *     responses:
 *       200:
 *         description: Successfully logged out
 *       500:
 *         description: Server error while logging out
 *     security:
 *       - sessionAuth: []
 */
router.post('/logout', (req, res, next) => {
  // Use passport's built-in method to log out the user.
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.sendStatus(200);
  });
});

/**
 * @swagger
 * /api/user/updateUser:
 *   put:
 *     summary: Update user information
 *     description: Updates the user's information, including their username(email), first name, last name, and phone number.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username(email)
 *               - first_name
 *               - last_name
 *               - phone_number
 *             properties:
 *               username:
 *                 type: string
 *                 example: newuser123
 *                 description: The updated username for the user.
 *               first_name:
 *                 type: string
 *                 example: Jane
 *                 description: The updated first name of the user.
 *               last_name:
 *                 type: string
 *                 example: Doe
 *                 description: The updated last name of the user.
 *               phone_number:
 *                 type: string
 *                 example: "1234567890"
 *                 description: The updated phone number of the user.
 *     responses:
 *       200:
 *         description: User information successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User information updated successfully"
 *       400:
 *         description: Bad request, missing required fields or invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "All fields are required"
 *       401:
 *         description: Unauthorized, user is not authenticated.
 *       500:
 *         description: Server error occurred while updating user information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An error occurred while updating user information. Please try again later."
 */
router.put('/updateUser', rejectUnauthenticated, (req, res, next) => {
  const username = req.body.username;
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const phone_number = req.body.phone_number;

  const sqlText = `
    UPDATE "user"
    SET 
      "username" = $1,
      "first_name" = $2,
      "last_name" = $3,
      "phone_number" = $4
    WHERE "id" = $5;
  `;
  const sqlValues = [username, first_name, last_name, phone_number, req.user.id];
  pool
    .query(sqlText, sqlValues)
    .then((result) => {
      console.log('User information has been updated for user ID:', req.user.id);
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log(`An error occured while updating user information`, error);
      res.sendStatus(500);
    });
});

module.exports = router;
