const express = require('express');
const color = require('colors');
const errorHandler = require('./middleware/error-handler');
const dotenv = require('dotenv').config();
const connectDb = require('./config/db');
const authMiddleware = require('./middleware/auth-middleware');

const app = express();

connectDb();

// middleware
app.use(express.json());
app.use(['/api/v1/profile/:slug/update', '/api/v1/posts/new'], authMiddleware);

app.use('/api/v1/about', require('./routes/about-route'));
app.use('/api/v1/login', require('./routes/login-route'));
app.use('/api/v1/posts', require('./routes/post-routes'));
app.use('/api/v1/profile', require('./routes/profile-routes'));
app.use('/api/v1/sign-up', require('./routes/sign-up-routes'));
app.use('*', require('./routes/not-found-route'));

app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () =>
  console.log(`Server started. Listening on port ${port}`.cyan)
);
