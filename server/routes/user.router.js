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
 *     tags: [session]
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
 * /user/{userId}:
 *   get:
 *     summary: Get user information by user ID
 *     description: Fetches user details by the provided user ID. The route returns the user's information (username, first name, last name, etc.) if the user exists. If there’s an error or the user doesn’t exist, an error message will be returned.
 *     tags: [user, session]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved user information
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The user's ID
 *                   username:
 *                     type: string
 *                     description: The user's username
 *                   first_name:
 *                     type: string
 *                     description: The user's first name
 *                   last_name:
 *                     type: string
 *                     description: The user's last name
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     description: The timestamp when the user was created
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *                     description: The timestamp when the user was last updated
 *       400:
 *         description: Bad request, invalid user ID format or missing parameters
 *       401:
 *         description: Unauthorized, user is not authenticated
 *       404:
 *         description: User not found, no user exists with the provided ID
 *       500:
 *         description: Internal server error, issue with the database or server
 */

router.get('/:userId', rejectUnauthenticated, (req, res) => {
  const queryText = `
  SELECT id, username, first_name, last_name, created_at, updated_at FROM "user" WHERE id = $1;
  `;
  pool
    .query(queryText, [req.params.userId])
    .then((result) => {
      res.send(result.rows);
    })
    .catch((error) => {
      console.log('error getting user by id', error);
      res.sendStatus(500);
    });
});

// Handles the logic for creating a new user.
// The password is hashed before being added to the database.
/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email of the user
 *               password:
 *                 type: string
 *                 description: Password of the user
 *               first_name:
 *                 type: string
 *                 description: First name of the user
 *               last_name:
 *                 type: string
 *                 description: Last name of the user
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {}
 */

router.post('/register', (req, res, next) => {
  const username = req.body.username;
  const hashedPassword = encryptLib.encryptPassword(req.body.password);
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;

  const sqlText = `
    INSERT INTO "user"
      ("username", "password", "first_name", "last_name")
      VALUES
      ($1, $2, $3, $4);
  `;
  const sqlValues = [username, hashedPassword, first_name, last_name];

  pool
    .query(sqlText, sqlValues)
    .then(() => {
      res.sendStatus(201);
    })
    .catch((dbErr) => {
      console.log('POST /api/user/register error: ', dbErr);
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
 *     tags: [Session]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               login:
 *                 type: string
 *                 description: email of user
 *               password:
 *                 type: string
 *                 description: you can't see me
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 message:
 *                   type: string
 *                   description: message of response
 *       400:
 *         description: Invalid credentials
 */
router.post('/login', userStrategy.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

// Clear all server session information about this user:
/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Logout a user
 *     description: Logs out the user by clearing their session.
 *     tags:
 *       - Authentication
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
 * /api/user:
 *   put:
 *     summary: Update user information
 *     description: This endpoint allows users to update their username, password, first name, and last name.
 *     tags:
 *       - Users
 *     requestBody:
 *       description: User data to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The user's new username.
 *               password:
 *                 type: string
 *                 description: The user's new password.
 *               first_name:
 *                 type: string
 *                 description: The user's first name.
 *               last_name:
 *                 type: string
 *                 description: The user's last name.
 *     responses:
 *       200:
 *         description: User information updated successfully.
 *       400:
 *         description: Bad request, missing required fields or invalid data.
 *       500:
 *         description: Internal server error, problem updating user information.
 *     security:
 *       - bearerAuth: []
 */

router.put('/', rejectUnauthenticated, (req, res, next) => {
  const username = req.body.username;
  const hashedPassword = encryptLib.encryptPassword(req.body.password);
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;

  const sqlText = `
    UPDATE "user"
    SET 
      "username" = $1,
      "password" = $2,
      "first_name" = $3,
      "last_name" = $4
    WHERE "id" = $5;
  `;

  const sqlValues = [req.body.username, hashedPassword, req.body.first_name, req.body.last_name, req.user.id];

  pool
    .query(sqlText, sqlValues)
    .then((result) => {
      console.log('User information has been updated');
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log(`Error making database query when updating user info ${sqlText}`, error);
      res.sendStatus(500);
    });
});

module.exports = router;
