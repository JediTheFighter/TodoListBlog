import express from 'express';
import bodyParser from 'body-parser'; 
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';

// Get the current file URL
const __filename = fileURLToPath(import.meta.url);

// Get the directory name
const __dirname = dirname(__filename);

const posts = [
  {id: '1', title: 'Sample Blog', content: 'Sample Content'}
  // Add more posts as needed
];

const app = express();
const port = process.env.PORT || 3000;

// Set the view engine to EJS
app.set('view engine', 'ejs');
// Set the views directory
app.set('views', join(__dirname, 'views'));

// Serve static files from the public directory
app.use(express.static(join(__dirname, 'public')));
// Use body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));



app.use((req, res, next) => {
    // Set the 'posts' variable in res.locals
    res.locals.posts = posts;
  
    // Call next() to pass control to the next middleware in the stack
    next();
});
  

// Home route
app.get('/', (req, res) => {
  res.render('index', { posts });
});

// Create post route (form)
app.get('/create', (req, res) => {
    res.render('create');
});
  
// Post route (handling form submission)
app.post('/create', (req, res) => {
  const { title, content } = req.body;

  const generatedUuid = uuidv4();
  const integerUuid = BigInt(`0x${generatedUuid.replace(/-/g, '')}`);

  // Assuming posts have unique IDs (e.g., generated with UUID)
  const newPost = { id: integerUuid.toString(), title, content };

  // Add the new post to the array (or save it to a database)
  posts.push(newPost);

  // Redirect to the home page after creating the post
  res.redirect(303, '/');
});

// View posts route
app.get('/view', (req, res) => {
    res.render('post_list', { posts });
});

// update requeast
app.post('/update/:id', (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const { title, content } = req.body;
  
  // Find the index of the post with the specified id
  const postIndex = posts.findIndex(post => post.id == postId);

  if (postIndex !== -1) {
    // Update the post if found
    posts[postIndex].title = title;
    posts[postIndex].content = content;
    res.redirect(303, '/view');
  } else {
    res.status(404).json({ message: 'Post not found' });
  }
});

// Edit route
app.get('/edit/:id', (req, res) => {
  const postId = parseInt(req.params.id, 10);
  
  // Find the index of the post with the specified id
  const postIndex = posts.findIndex(post => post.id == postId);

  // If the post is found, move to edit post screen
  if (postIndex !== -1) {
    res.render('edit_post', { post: posts[postIndex]});
  } else {
    res.status(404).json({ message: 'Post not found' });
  }
});

// Delete route
app.get('/delete/:id', (req, res) => {
  const postId = parseInt(req.params.id, 10);
  
  // Find the index of the post with the specified id
  const postIndex = posts.findIndex(post => post.id == postId);

  // If the post is found, remove it from the array
  if (postIndex !== -1) {
    posts.splice(postIndex, 1);
    res.redirect(303, '/view');
  } else {
    res.status(404).json({ message: 'Post not found' });
  }
});

// Post route
app.get('/post/:id', (req, res) => {
  const postId = req.params.id;
  const post = posts.find(post => post.id === postId);

  if (post) {
    res.render('post', { post });
  } else {
    res.status(404).send('Post not found');
  }
});

app.listen(port, () => {
  console.log(`Server is running at port: ${port}`);
});
