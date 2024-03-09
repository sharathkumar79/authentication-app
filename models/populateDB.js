// populateDB.js

const mongoose = require('mongoose');
const faker = require('faker');
const Post = require('./Posts'); // Import your Post model

// Connect to MongoDB
mongoose.connect("mongodb+srv://sharathkumarananthula79:CpO5N5XFx9JE40R4@cluster0.6sy0xq8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Function to generate random posts
const generateDummyPosts = () => {
  const posts = [];

  for (let i = 0; i < 100; i++) {
    const post = {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      author: faker.name.findName(),
      // Add more fields as needed
    };

    posts.push(post);
  }

  return posts;
};

// Function to insert dummy posts into MongoDB
const insertDummyPosts = async () => {
  const dummyPosts = generateDummyPosts();

  try {
    await Post.insertMany(dummyPosts);
    console.log('Dummy posts inserted successfully.');
  } catch (error) {
    console.error('Error inserting dummy posts:', error);
  } finally {
    // Disconnect from MongoDB
    mongoose.disconnect();
  }
};

// Call the function to insert dummy posts
insertDummyPosts();
