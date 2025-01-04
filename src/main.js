import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';

// App Initialization
const app = express();
app.use(bodyParser.json({ limit: '50mb' })); // Increase limit for base64 images
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/travelSphere', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Schemas and Models
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    profilePicture: String
});
const PostSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    location: String,
    description: String,
    timeOfVisit: Date,
    photos: [String], // Array of base64-encoded photos
    geotag: { 
        type: { type: String, enum: ['Point'], required: true }, // GeoJSON type
        coordinates: { type: [Number], required: true } // [longitude, latitude]
    },
    likes: { type: Number, default: 0 }
});
const User = mongoose.model('User', UserSchema);
const Post = mongoose.model('Post', PostSchema);

// Routes

// User Registration
app.post('/register', async (req, res) => {
    try {
        const { email, username, password, profilePicture } = req.body;
        const user = new User({ email, username, password, profilePicture });
        await user.save();
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// User Login
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        res.status(200).json({ message: 'Login successful', user });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Create a Post
app.post('/posts', async (req, res) => {
    try {
        const { userId, location, description, timeOfVisit, photos, geotag } = req.body;
        const post = new Post({ userId, location, description, timeOfVisit, photos, geotag });
        await post.save();
        res.status(201).json({ message: 'Post created successfully', post });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get User Travel Map
app.get('/users/:userId/map', async (req, res) => {
    try {
        const { userId } = req.params;
        const posts = await Post.find({ userId });
        res.status(200).json(posts);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Browse Global Map
app.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find({})
            .populate('userId', 'username')  // Populate the userId field with only 'username'
            .exec();

        // Transform the posts to include username directly in the post object, and remove the nested 'user' object
        const postsWithUsername = posts.map(post => ({
            ...post.toObject(),
            username: post.userId.username,  // Add the username directly to the post object
            userId: post.userId._id // Keep the userId as an ID, not as an object
        }));

        res.status(200).json(postsWithUsername);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update Post
app.put('/posts/:postId', async (req, res) => {
    try {
        const { postId } = req.params;
        const updates = req.body;
        const updatedPost = await Post.findByIdAndUpdate(postId, updates, { new: true });
        res.status(200).json({ message: 'Post updated successfully', updatedPost });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete Post
app.delete('/posts/:postId', async (req, res) => {
    try {
        const { postId } = req.params;
        await Post.findByIdAndDelete(postId);
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Like a Post
app.post('/posts/:postId/like', async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        post.likes += 1;
        await post.save();
        res.status(200).json({ message: 'Post liked successfully', post });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Start Server
const PORT = process.env.PORT || 5900;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
