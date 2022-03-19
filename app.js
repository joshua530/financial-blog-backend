const express = require('express');
const color = require('colors');
const errorHandler = require('./middleware/error-handler');
const dotenv = require('dotenv').config();
const connectDb = require('./config/db');
const authMiddleware = require('./middleware/auth-middleware');
const headerMiddleware = require('./middleware/headers-middleware');
const path = require('path');

const app = express();

connectDb();

// middleware
app.use(express.json());
app.use(headerMiddleware);
app.use(
  [
    '/api/v1/comments/create',
    '/api/v1/comments/delete/:id',
    '/api/v1/profile/:slug/update',
    '/api/v1/profile/:slug/update-password',
    '/api/v1/posts/new',
    '/api/v1/posts/:post_slug/update',
    '/api/v1/posts/:post_slug/delete'
  ],
  authMiddleware
);

app.use('/static', express.static(path.join(__dirname, 'public')));

app.use('/api/v1/about', require('./routes/about-route'));
app.use('/api/v1/comments', require('./routes/comment-routes'));
app.use('/api/v1/home', require('./routes/home-route'));
app.use('/api/v1/login', require('./routes/login-route'));
app.use('/api/v1/posts', require('./routes/post-routes'));
app.use('/api/v1/profile', require('./routes/profile-routes'));
app.use('/api/v1/sign-up', require('./routes/sign-up-routes'));
// forward all requests to index.html
app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () =>
  console.log(`Server started. Listening on port ${port}`.cyan)
);
