const { Thought, User } = require('../models');

// Function to get all thoughts
const getThoughts = async (req, res) => {
    try {
        const thoughts = await Thought.find();
        res.json(thoughts);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Function to get a single thought by its _id
const getSingleThought = async (req, res) => {
    try {
        const thoughtId = req.params.thoughtId;
        const thought = await Thought.findById(thoughtId);
        res.json(thought);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Function to create a new thought
const createThought = async (req, res) => {
    try {
        const { thoughtText, username, userId } = req.body;
        const thought = await Thought.create({ thoughtText, username });
        const user = await User.findById(userId);
        user.thoughts.push(thought._id);
        await user.save();
        res.json(thought);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Function to update a thought by its _id
const updateThought = async (req, res) => {
    try {
        const thoughtId = req.params.thoughtId;
        const updatedThought = await Thought.findByIdAndUpdate(thoughtId, req.body, { new: true });
        res.json(updatedThought);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Function to delete a thought by its _id
const deleteThought = async (req, res) => {
    try {
        const thoughtId = req.params.thoughtId;
        await Thought.findByIdAndDelete(thoughtId);
        res.json({ message: 'Thought deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Function to create a reaction stored in a single thought's reactions array field
const createReaction = async (req, res) => {
    try {
        const thoughtId = req.params.thoughtId;
        const reactionData = req.body;
        const thought = await Thought.findById(thoughtId);
        thought.reactions.push(reactionData);
        await thought.save();
        res.json(thought);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Function to pull and remove a reaction by the reaction's reactionId value
const deleteReaction = async (req, res) => {
    try {
        const thoughtId = req.params.thoughtId;
        const reactionId = req.body.reactionId;
        const thought = await Thought.findById(thoughtId);
        thought.reactions = thought.reactions.filter((reaction) => reaction.reactionId !== reactionId);
        await thought.save();
        res.json(thought);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getThoughts,
    getSingleThought,
    createThought,
    updateThought,
    deleteThought,
    createReaction,
    deleteReaction,
};
