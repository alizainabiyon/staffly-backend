// @Dependencies
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('./controllers/app/cronJobs');
const http = require('http');

//@Middlewares
const {
  requestValidator,
  errorHandler,
  errorLogger,
  dataLogger,
  filesParser,
} = require('./middlewares');

// Import mongo connection
const { connectMongoDB } = require('./lib/connections/mongoDB');

// Import-Routes
const router = require('./routes');
const { randomConstant } = require('./constants/random.constant');
const { PORT } = randomConstant;

// Init Server
const app = express();
const server = http.createServer(app);

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.set('trust proxy', true);

app.get('/', (req, res) => {
  res.send('hello world');
});
app.get('/helth', (req, res) => {
  res.send('every this is working fine');
});

app.use(filesParser);
app.use(dataLogger);
app.use(requestValidator);

// Routes
app.use('/api', router);

// Error Logger
app.use(errorLogger);

// Error Handler
app.use(errorHandler);

// Start Server
// @Establish Connection with Persistance && Start Server
server.listen(PORT, async () => {
  await connectMongoDB();
  console.log('server started @', new Date(), '\nOn Port ::: ', PORT);
});
