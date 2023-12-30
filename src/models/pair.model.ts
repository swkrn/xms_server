import mongoose from 'mongoose'

const pairSchema = new mongoose.Schema({
    first_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    second_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    last_message: {
        type: String,
        required: true,
    },
    last_time: {
        type: Date,
        required: true,
    }
})

export default mongoose.model('Pair', pairSchema)