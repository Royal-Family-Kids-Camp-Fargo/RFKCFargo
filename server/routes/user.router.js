const express = require('express');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');


const router = express.Router();

// If the request came from an authenticated user, this route
// sends back an object containing that user's information.
// Otherwise, it sends back an empty object to indicate there
// is not an active session.
router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(req.user);
  } else {
    res.send({});
  }
});

// Handles the logic for creating a new user. The one extra wrinkle here is
// that we hash the password before inserting it into the database.
/**
 * @swagger
 * /register:
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

  const sqlText = `
    INSERT INTO "user"
      ("username", "password")
      VALUES
      ($1, $2);
  `;
  const sqlValues = [username, hashedPassword];

  pool.query(sqlText, sqlValues)
    .then(() => {
      res.sendStatus(201)
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
 * /login:
 *   post:
 *     summary: Login a user
 *     tags: [Session, no-nlapi]
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
router.post('/logout', (req, res, next) => {
  // Use passport's built-in method to log out the user.
  req.logout((err) => {
    if (err) { 
      return next(err); 
    }
    res.sendStatus(200);
  });
});


module.exports = router;
