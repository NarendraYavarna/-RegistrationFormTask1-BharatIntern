const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
require('dotenv').config();

const ConnectionUri = process.env.MONGODB_URI;

mongoose.connect(ConnectionUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  

// Define user schema
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String
});

// Create User model
const User = mongoose.model('User', userSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Route to serve the registration form
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Route to handle user registration
app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    // Save the user to the database using async/await
    await newUser.save();

    res.send('Registration successful!');
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).send('Registration failed. Please try again.');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
