const connection = require('../config/connection');
const { User, Thought } = require('../models');
const { getRandomEmail, getRandomUsername, getRandomThoughts } = require('./data');

connection.on('error', (err) => err);

connection.once('open', async () => {
    console.log('connected');

    // Drop existing Thoughts
    await Thought.deleteMany({});

    // Drop existing Users
    await User.deleteMany({});

    // Generate an array of users with usernames and emails
    const usersData = Array.from({ length: 20 }, () => ({
        username: getRandomUsername(),
        email: getRandomEmail(),
    }));

    // Create all users in the User collection
    await User.collection.insertMany(usersData);

    // Generate an array of thoughts with thoughtText, createdAt, reactions, and username
    const thoughts = usersData.flatMap((user) => {
        return getRandomThoughts(3).map((thoughtText) => ({
            thoughtText,
            createdAt: new Date(),
            reactions: [],
            username: user.username,
            user_id: user._id
        }));
    });

    // Insert all thoughts into the Thought collection
    const savedThoughts = await Thought.collection.insertMany(thoughts);
    const thoughtIds = Object.values(savedThoughts.insertedIds);

    // Loop through each user and update their thoughts with the corresponding thought IDs
    for (const user of usersData) {
        const userThoughts = thoughts.filter((thought) => thought.username === user.username);
        const thoughtIdsToUpdate = userThoughts.map((thought) => thoughtIds[thoughts.indexOf(thought)]);
        await User.findByIdAndUpdate(
            user._id,
            { $push: { thoughts: { $each: thoughtIdsToUpdate } } }
        );
    }

    console.log('Seeding complete! 🌱');
    process.exit(0);
});
