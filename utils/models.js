const User = require('../models/user-model');
const AutoIncrement = require('../models/autoincrement-model');

/************ user model ************/
/**
 * removes sensitive data that shouldn't be sent to the front end
 */
const cleanUser = (user) => {
  let tmp = {};
  Object.assign(tmp, user.toJSON());
  tmp['id'] = tmp['_id'];
  delete tmp['_id'];
  delete tmp['password'];
  delete tmp['__v'];
  return tmp;
};

const ensureEmailIsUnique = async (req, res, email) => {
  const userWithEmail = await User.find({ email });
  if (userWithEmail.length > 0) {
    res.status(400);
    throw new Error('user with that email already exists');
  }
};

const ensureUsernameIsUnique = async (req, res, username) => {
  const userWithUsername = await User.find({ username });
  if (userWithUsername.length > 0) {
    res.status(400);
    throw new Error('user with that username already exists');
  }
};

/**************** post model ***************/
/**
 * Formats post data
 *
 * @param post the post to be shortened
 * @param truncateContent boolean indicating whether content should be shortened
 *
 * @return formatted post
 */
const cleanPost = (post, truncateContent = false) => {
  let newPost = {};
  Object.assign(newPost, post.toJSON());
  newPost['id'] = post['id'];
  delete newPost['_id'];
  newPost['datePosted'] = formatDate(post['datePosted']);
  newPost['dateUpdated'] = formatDate(post['dateUpdated']);
  let content = newPost['content'];
  if (truncateContent && content.length > 30) {
    console.log(content);
    content = content.substr(0, 100);
    content = content + '...';
  }
  newPost['content'] = content;
  delete newPost['__v'];
  return newPost;
};

function formatDate(timeString) {
  const current = new Date(timeString);
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];
  const year = current.getFullYear();
  const month = months[current.getMonth()];
  const day = current.getDate();

  const formatted = `${day} ${month}, ${year}`;
  return formatted;
}

const nextPostId = async () => {
  let current = await AutoIncrement.findOne({ collectionName: 'posts' });
  if (!current) {
    current = await AutoIncrement.create({ collectionName: 'posts' });
  }
  return current.currentId;
};

const incrementPostId = async (currentId) => {
  await AutoIncrement.findOneAndUpdate(
    { collectionName: 'posts' },
    { currentId: currentId + 1 }
  );
};

//############### comment model ################
const cleanComment = (comment) => {
  let tmp = {};
  Object.assign(tmp, comment.toJSON());
  delete tmp['__v'];
  tmp['id'] = tmp['_id'];
  delete tmp['_id'];
  delete tmp['postSlug'];
  return tmp;
};

/**************** general ****************/
const createSlug = (name) => {
  return name.replace(/\s+/g, '-');
};

const randomToken = () => {
  const tok = Math.random().toString(36).substring(2);
  const tok2 = Math.random().toString(36).substring(2);
  return tok + tok2;
};

module.exports = {
  cleanUser,
  ensureEmailIsUnique,
  ensureUsernameIsUnique,
  createSlug,
  randomToken,
  cleanPost,
  nextPostId,
  incrementPostId,
  cleanComment
};
