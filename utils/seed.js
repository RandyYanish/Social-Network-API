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

    // Create empty array to hold users
    const users = [];

    // Loop 20 times -- add users to the users array
    for (let i = 0; i < 20; i++) {
        // Get random thoughts, usernames, and emails using a helper function imported from ./data
        const thoughts = getRandomThoughts(3);
        const username = getRandomUsername();
        const email = getRandomEmail();

        users.push({
            username,
            email,
            thoughts,
        });
    }

    // Add users to the collection and await the results
    await User.collection.insertMany(users);

    // Log out the seed data to indicate what should appear in the database
    console.table(users);
    console.info('Seeding complete! 🌱');
    process.exit(0);
});
