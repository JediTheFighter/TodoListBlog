import express from 'express';
import bodyParser from 'body-parser'; 
import path from 'path';

const posts = [
  { id: '1', title: 'First Post', content: 'This is the content of the first post.' },
  { id: '2', title: 'Second Post', content: 'This is the content of the second post.' },
  // Add more posts as needed
];

const app = express();
const router = express.Router();
const port = process.env.PORT || 3000;

// Set the view engine to EJS
app.set('view engine', 'ejs');
// Set the views directory
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static("public"));
// Use body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));



app.use((req, res, next) => {
    // Set the 'posts' variable in res.locals
    res.locals.posts = posts;
  
    // Call next() to pass control to the next middleware in the stack
    next();
  });
  

// Home route
router.get('/', (req, res) => {
  res.render('index', { posts });
});

// Create post route (form)
router.get('/create', (req, res) => {
    res.render('create');
});
  
// Post route (handling form submission)
router.post('/create', (req, res) => {
  const { title, content } = req.body;

  // Assuming posts have unique IDs (e.g., generated with UUID)
  const newPost = { id: Math.random().toString(), title, content };

  // Add the new post to the array (or save it to a database)
  posts.push(newPost);

  // Redirect to the home page after creating the post
  res.redirect('/');
});

// View posts route
router.get('/view', (req, res) => {
    res.render('post_list', { posts });
});

// Post route
router.get('/post/:id', (req, res) => {
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
  console.log(`Server is running at port: ${port}`);
});