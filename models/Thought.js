const { Schema, model } = require('mongoose');

const thoughtSchema = new Schema(
    {
        thougthText: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280,
        },
        createdAt: {
            type: Date,
            default: (Date.now),
        },
        username: {
            type: String,
            required: true,
        },
        reactions: [reactionSchema],
    },
    {
        toJSON: {
            getters: true,
        },
    }
);

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;
