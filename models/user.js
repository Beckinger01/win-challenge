import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
    email: {
        type: String,
        unique: [true, 'Email already exists!'],
        required: [true, 'Email is required!'],
    },
    username: {
        type: String,
        required: [true, 'Username is required!'],
        match: [/^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![._])$/,
            "Username invalid, it should contain 4-20 alphanumeric letters and be unique!"]
    },
    password: {
        type: String,
    },
    image: {
        type: String,
    },
    resetToken: {
        type: String
    },
    resetTokenExpiry: {
        type: Number
    }
});

const User = models.User || model("User", UserSchema);

export default User;
