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

    // Generate an array of 20 users with associated thoughts
    const users = Array.from({ length: 20 }, () => {
        const username = getRandomUsername();
        const email = getRandomEmail();
        const thoughts = getRandomThoughts(3).map((thoughtText) => ({
            thoughtText,
            username,
        }));

        // TODO: split thoughts so the objects don't get pushed to User and also random Math the reactions and friends

        return {
            username,
            email,
            thoughts,
        };
    });

    // Add users to the collection and await the results
    await User.collection.insertMany(users);

    // Flatten the thoughts array to insert into the Thought collection
    const allThoughts = users.flatMap((user) => user.thoughts);

    // Insert all thoughts into the Thought collection
    await Thought.collection.insertMany(allThoughts);

    // Log out the seed data to indicate what should appear in the database
    console.table(users);
    console.info('Seeding complete! 🌱');
    process.exit(0);
});
