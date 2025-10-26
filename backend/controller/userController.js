const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { JWT_SECRET = 'your_jwt_secret' } = process.env;

const addUser = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;

    if (!name || !username || !password) {
      return res.status(400).json({ error: 'Name, username and password are required' });
    }

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    const newUser = await User.create({ name, email, username, password });

    res.status(201).json({ status: 200, message: 'User created successfully', user: { username: newUser.username, name: newUser.name, email: newUser.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add user', details: err.message });
  }
};


const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: 'Invalid username or password' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid username or password' });

    // Generate JWT token
    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      status: 200,
      message: 'Login successful',
      user: { username: user.username, name: user.name, email: user.email, _id: user._id },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
};


const getUser = async (req, res) => {
  try {
    const users = await User.find();
    if (!users || users.length === 0) {
      return res.status(200).json({ message: "User not found", data: [] });
    }
    return res.status(200).json({ message: "Users fetched successfully", data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch users", details: error.message });
  }
};



module.exports = { addUser, getUser, loginUser };
