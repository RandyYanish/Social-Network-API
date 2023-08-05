const { Thought, User } = require('../models');

// Function to get all users
const getUsers = async (req, res) => {
    try {
        const users = await User.find().populate('thoughts');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Function to get a single user by its _id and populate thought and friend data
const getSingleUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).populate('thoughts').populate('friends');
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Function to create a new user
const createUser = async (req, res) => {
    try {
        const { username, email } = req.body;
        const newUser = await User.create({ username, email });
        res.json(newUser);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Function to update a user by its _id
const updateUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Function to delete a user by its _id
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        // BONUS: Removing the user's ID from other users' friends list
        await User.updateMany({}, { $pull: { friends: userId } });
        // Removing a user's associated thoughts when deleted
        await Thought.deleteMany({ username: userId });
        await User.findByIdAndDelete(userId);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Function to add a new friend to a user's friend list
const addFriend = async (req, res) => {
    try {
        const userId = req.params.userId;
        const friendId = req.params.friendId;
        const user = await User.findById(userId);
        user.friends.push(friendId);
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' + error });
    }
};

// Function to remove a friend from a user's friend list
const removeFriend = async (req, res) => {
    try {
        const userId = req.params.userId;
        const friendId = req.params.friendId;
        const user = await User.findById(userId);
        user.friends = user.friends.filter((friend) => friend.toString() !== friendId);
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getUsers,
    getSingleUser,
    createUser,
    updateUser,
    deleteUser,
    addFriend,
    removeFriend,
};
