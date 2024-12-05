const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const app = express();
const server = createServer(app);
const cors = require('cors');
const mongoose = require('mongoose');

// MongoDB Connection
mongoose.connect('mongodb+srv://Rimsha:RimAtlas@cluster0.ij9mujl.mongodb.net/chat-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'Connection error:'));
  db.once('open', () => console.log('Connected to MongoDB'));

const { register } = require("./controller/register");
const highPriorityMessage = require("./model/highPriorityMessage");
const midPriorityMessage = require("./model/midPriorityMessage");
const lowPriorityMessage = require("./model/lowPriorityMessage");
const { totalPendingQuery, replyToClient, fetchPreviousQuestion, fetchPendingQuestion, replyToPendingQuestion } = require("./controller/query");
const { join } = require("path");

const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

app.use(express.json());

app.use(cors({
    origin: '*'
}))

app.post('/register', register);
app.get('/totalPendingQuery', totalPendingQuery);
app.post('/replyToClient', replyToClient)
app.post('/fetchPreviousQuestion', fetchPreviousQuestion);
app.post('/fetchPendingQuestion', fetchPendingQuestion);
app.post('/replyToPendingQuestion', replyToPendingQuestion);

const queriesPickedMessageToAgent = {}
const queriesPickedAgentToMessage = {}

io.on('connection', (socket) => {
    const { _id, name, role } = socket.handshake.query;
    if (role === 'Client') {
        socket.join(_id);
    }
    if (role === 'Agent') {
        socket.join('Agent');
    }
    socket.on('clientSendQuery', async (data) => {
        const regex1 = new RegExp('Loan', 'i');
        const regex2 = new RegExp('Payment', 'i');
        const regex3 = new RegExp('Pay', 'i');
        if (regex1.test(data?.chat)) {
            data = { ...data, priority: '0' };
            const message = new highPriorityMessage({
                name: data?.name,
                role: data?.role,
                clientId: data?._id,
                query: data?.chat
            });
            await message.save();
            data = { ...data, messageId: message._id.toString() };
            socket.to('highPriorityRoom').emit('queryInHighPriorityRoom', data);
        }
        else if (regex2.test(data?.chat) || regex3.test(data?.chat)) {
            data = { ...data, priority: '1' };
            const message = new midPriorityMessage({
                name: data?.name,
                role: data?.role,
                clientId: data?._id,
                query: data?.chat
            });
            await message.save();
            data = { ...data, messageId: message._id.toString() };
            socket.to('mediumPriorityRoom').emit('queryInMediumPriorityRoom', data);;
        }
        else {
            data = { ...data, priority: '2' };
            const message = new lowPriorityMessage({
                name: data?.name,
                role: data?.role,
                clientId: data?._id,
                query: data?.chat
            });
            await message.save();
            data = { ...data, messageId: message._id.toString() };
            socket.to('lowPriorityRoom').emit('queryInLowPriorityRoom', data);;
        }
        const totalPendingQuery = [];
        const count1 = await lowPriorityMessage.find({ ans: [] }).countDocuments();
        const count2 = await midPriorityMessage.find({ ans: [] }).countDocuments();
        const count3 = await highPriorityMessage.find({ ans: [] }).countDocuments();
        totalPendingQuery.push(count1);
        totalPendingQuery.push(count2);
        totalPendingQuery.push(count3);
        io.to('Agent').emit('agentReceiveQuery', { totalPendingQuery });
    });
    socket.on('agentAnswerQuery', (data) => {
        socket.to(data.clientId).emit('clientReceiveAnswer', data);
    });
    socket.on('agentJoinRoom', (data) => {
        const { roomType } = data;
        socket.join(roomType);
    });
    socket.on('agentLeaveRoom', (data) => {
        const { roomType } = data;
        socket.leave(roomType);

    });
    socket.on('agentPickQuestion', (data) => {
        const { messageId, agentId, roomType } = data;
        if (!queriesPickedMessageToAgent[messageId]) {
            queriesPickedMessageToAgent[queriesPickedAgentToMessage[agentId]] = null;
            queriesPickedMessageToAgent[messageId] = agentId;
            queriesPickedAgentToMessage[agentId] = messageId;
            io.to(roomType).emit('agentPickedQuestion', { message: 'Agent Picked Question', queriesPickedMessageToAgent: queriesPickedMessageToAgent, queriesPickedAgentToMessage: queriesPickedAgentToMessage });
        }
        else {
            socket.emit('agentPickedQuestion', { message: 'Question Picked By Another Agent', queriesPickedMessageToAgent: queriesPickedMessageToAgent, queriesPickedAgentToMessage: queriesPickedAgentToMessage });
        }
    });
    socket.on('disconnect', () => { });
});

module.exports = server;
