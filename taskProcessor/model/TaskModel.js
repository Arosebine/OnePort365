const mongoose = require('mongoose');


const Task = new mongoose.Schema({
  userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    status: {
        type: String,
        default: "PENDING",
        enum: ["PENDING", "IN PROGRESS", "COMPLETED", "FAILED"]
    },
    title: {
        type: String,
    },
    description: {
        type: String
    },
    approvedBy: {
        type: String,
    }
},
{
    timestamps: true
}
);


module.exports = mongoose.model('Task', Task);