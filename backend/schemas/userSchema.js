import mongoose from "mongoose"

const User = new mongoose.Schema({
    googleId: {
        type: String,
        required: true
    },
    displayName: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    avatar: {
        type: String
    }
})

const userSchema = mongoose.model('userSchema', User)

export default userSchema;