import { Schema, model, models } from "mongoose";

const BugSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Bug title is required!'],
    },
    message: {
        type: String,
        required: [true, 'Bug description is required!'],
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    username: {
        type: String,
    },
    status: {
        type: String,
        enum: ['open', 'in-progress', 'resolved'],
        default: 'open',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Bug = models.Bug || model("Bug", BugSchema);

export default Bug;