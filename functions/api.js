import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bodyParser from 'body-parser'; 
import serverless from 'serverless-http';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const port = 3000;

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));

// Serve static files
app.use(express.static(join(__dirname, 'public')));
// Use body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Include posts
import { posts } from './posts.js';

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

// Assuming posts have unique IDs (e.g., generated with UUID)
const newPost = { id: Math.random().toString(), title, content };

// Add the new post to the array (or save it to a database)
posts.push(newPost);

// Redirect to the home page after creating the post
res.redirect('/');
});

// View posts route
app.get('/view', (req, res) => {
    res.render('post_list', { posts });
});

// Post route
app.get('/post/:id', (req, res) => {
  const postId = req.params.id;
  console.log("postID "+ postId+ " \n posts: "+posts);
  const post = posts.find(post => post.id === postId);

  if (post) {
    res.render('post', { post });
  } else {
    res.status(404).send('Post not found');
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

app.use('/.netlify/functions/api', express.Router());
module.exports.handler = serverless(app);