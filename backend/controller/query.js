const highPriorityMessage = require("../model/highPriorityMessage");
const lowPriorityMessage = require("../model/lowPriorityMessage");
const midPriorityMessage = require("../model/midPriorityMessage");

const totalPendingQuery = (req, res, next) => {
    const totalPendingQuery = [];
    lowPriorityMessage.find({ ans: [] }).countDocuments().then((data) => {
        totalPendingQuery.push(data);
        midPriorityMessage.find({ ans: [] }).countDocuments().then((data) => {
            totalPendingQuery.push(data);
            highPriorityMessage.find({ ans: [] }).countDocuments().then((data) => {
                totalPendingQuery.push(data);
                res.status(200).json({
                    success: true,
                    message: 'Total Pending Query',
                    totalPendingQuery: totalPendingQuery
                })
            })
        })
    })
};

const replyToClient = (req, res, next) => {
    let collection
    const { ans, messageId, replyMessagePriority } = req.body;
    if (replyMessagePriority === '0') {
        collection = require('./../model/highPriorityMessage');
        try {
            collection.findByIdAndUpdate(messageId, {
                $push: {
                    'ans': ans
                }
            }).then(() => { });
        } catch (error) {
            console.log(error);
        }
    }
    else if (replyMessagePriority === '1') {
        collection = require('./../model/midPriorityMessage');
        try {
            collection.findByIdAndUpdate(messageId, {
                $push: {
                    'ans': ans
                }
            }).then(() => { });
        } catch (error) {
            console.log(error);
        }
    }
    else {
        collection = require('./../model/lowPriorityMessage');
        try {
            collection.findByIdAndUpdate(messageId, {
                $push: {
                    'ans': ans
                }
            }).then(() => { });
        } catch (error) {
            console.log(error);
        }
    }
    res.status(200).json({
        success: true,
    })
};

const fetchPreviousQuestion = async (req, res, next) => {
    const { clientId } = req.body;
    const data1 = await lowPriorityMessage.find({ clientId });
    const data2 = await midPriorityMessage.find({ clientId });
    const data3 = await highPriorityMessage.find({ clientId });
    const finalResponse = {
        data: [...data1, ...data2, ...data3]
    };
    res.status(200).json({
        success: true,
        message: 'Previous Question',
        data: finalResponse
    });
};

const fetchPendingQuestion = async (req, res, next) => {
    const { roomType } = req.body;
    let collection;
    if (roomType === 'lowPriorityRoom') {
        collection = require('./../model/lowPriorityMessage');
    }
    else if (roomType === 'mediumPriorityRoom') {
        collection = require('./../model/midPriorityMessage')
    }
    else {
        collection = require('./../model/highPriorityMessage');
    }
    const data = await collection.find({ ans: [] });
    res.status(200).json({
        success: true,
        message: 'Penidng Question',
        data: data
    });
};

const replyToPendingQuestion = async (req, res, next) => {
    const { _id, message, roomType } = req.body;
    let collection;
    if (roomType === 'lowPriorityRoom') {
        collection = require('./../model/lowPriorityMessage');
    }
    else if (roomType === 'mediumPriorityRoom') {
        collection = require('./../model/midPriorityMessage')
    }
    else {
        collection = require('./../model/highPriorityMessage');
    }
    await collection.findByIdAndUpdate(_id, {
        $push: {
            ans: message
        }
    })
    res.status(200).json({
        success: true,
        message: 'Question Answered Successfully',
    });
}

module.exports = { totalPendingQuery, replyToClient, fetchPreviousQuestion, fetchPendingQuestion, replyToPendingQuestion };