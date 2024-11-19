require('dotenv').config();
const express = require('express');

// Install Swagger Packages
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Instantiate an express server:
const app = express();

const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'RFKC EDA Client Project',
        version: '1.0.0',
        description: 'API documentation for My RFKC App',
      },
      servers: [
        {
          url: 'http://localhost:5001',
        },
      ],
      components: {
        securitySchemes: {
          cookieAuth: {
            type: 'apiKey',
            in: 'cookie',
            name: 'user',
          },
        },
      },
      security: [
        {
          cookieAuth: [],
        },
      ],
    },
    apis: ["./server/routes/*.js", "./server/models/*.js"],
  };
// Initialize Swagger JSDoc
const swaggerDocs = swaggerJsDoc(swaggerOptions);
// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Use process.env.PORT if it exists, otherwise use 5001:
const PORT = process.env.PORT || 5001;

// Require auth-related middleware:
const sessionMiddleware = require('./modules/session-middleware');
const passport = require('./strategies/user.strategy');

// Require router files:
const userRouter = require('./routes/user.router');
const pipelineRouter = require('./routes/pipeline.router');
const formRouter = require('./routes/form.router');
const actionRouter = require('./routes/action.router');
const submissionRouter = require('./routes/submission.router');

// Apply middleware:
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('build'));
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

// Apply router files:
app.use('/api/user', userRouter);
app.use('/api/actions', actionRouter);
app.use('/api/form', formRouter);
app.use('/api/pipeline', pipelineRouter);
app.use('/api/submission', submissionRouter);
// Start the server:
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
