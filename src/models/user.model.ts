import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: (value: String) => {
            return value.length >= 3 && value.length <= 20
        }
    },
    hashedPassword: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model('User', userSchema)