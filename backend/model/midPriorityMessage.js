const { Schema, model, default: mongoose } = require('mongoose');
const messageSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    agentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    query: {
        type: String,
        default: ""
    },
    ans: {
        type: Array,
        default: [],
    },
    priority: {
        type: String,
        default: "1"
    },
});

const midPriorityMessage = model('midPriorityMessage', messageSchema);
module.exports = midPriorityMessage;