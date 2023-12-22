import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
    from_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    to_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    time: {
        type: Date,
        default: Date.now,
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false,
        required: true,
    }
})

export default mongoose.model('Message', messageSchema)