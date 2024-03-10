const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors')
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// // Apply rate limiting middleware
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   message: 'Too many requests from this IP, please try again later.',
// });

// // Middleware

// app.use(limiter);

// app.use((req, res, next) => {
//   res.setHeader('Content-Security-Policy', "script-src 'self'");
//   next();
// });


app.use(cors());
app.use(express.json());

// app.use(() => {
//   console.log("hello world");
// })

// Routes
const authRoutes = require('./routes/Auth');
const postsRoutes = require('./routes/PostsRoutes');
app.use('/api/auth', authRoutes);
app.use('/api',postsRoutes)

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});




// Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


