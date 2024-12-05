import React, { useEffect, useState } from "react";
import { socket } from "../../socket";
import { useNavigate } from "react-router-dom";
import { replyToClient } from "../../Api";
import Question from "../Question/Question";
import Pending from "../Question/Pending";
const Home = () => {
    const navigate = useNavigate();
    const [chat, setChat] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [replyClientId, setReplyClientId] = useState('');
    const [messageId, setMessageId] = useState('');
    const [replyMessagePriority, setReplyMessagePriority] = useState('');
    const [queriesPickedByAgent, setQueriesPickedByAgent] = useState({});
    const [searchByClientId, setSearchByClientId] = useState('');
    const [searchByClientName, setSearchByClientName] = useState('');
    const [searchByClientMessage, setSearchByClientMessage] = useState('');
    const handleQuery = (e) => {
        setChat(e.target.value);
    };
    const sendQuery = () => {
        if (localStorage.getItem('role') === 'Client') {
            socket.emit('clientSendQuery', {
                _id: localStorage.getItem('_id'),
                name: localStorage.getItem('name'),
                role: localStorage.getItem('role'),
                chat: chat
            })
            setChatHistory((prevValue) => {
                return [...prevValue, {
                    _id: localStorage.getItem('_id'),
                    name: localStorage.getItem('name'),
                    role: localStorage.getItem('role'),
                    chat: chat
                }]
            });
            setChat('');
        }
        else {
            socket.emit('agentAnswerQuery', {
                clientId: replyClientId,
                name: localStorage.getItem('name'),
                role: localStorage.getItem('role'),
                chat: chat
            })
            setChatHistory((prevValue) => {
                return [...prevValue, {
                    _id: localStorage.getItem('_id'),
                    name: localStorage.getItem('name'),
                    role: localStorage.getItem('role'),
                    chat: chat
                }]
            });
            const data = {
                ans: chat,
                messageId: messageId,
                replyMessagePriority: replyMessagePriority
            };
            replyToClient(data).then(() => {
                console.log('Successfully Updated');
            });
            setChat('');
        }
    };
    const handleChange = (e) => {
        if (e.target.name === "searchByClientId") {
            setSearchByClientId(e.target.value);
        }
        else if (e.target.name === "searchByClientName") {
            setSearchByClientName(e.target.value);
        }
        else {
            setSearchByClientMessage(e.target.value);
        }

    };
    const pick = (messageId) => {
        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);
        const data = {
            messageId, agentId: localStorage.getItem('_id'), roomType: params.get('roomType')
        }
        socket.emit('agentPickQuestion', data)
    };
    const backToRoom = () => {
        navigate('/room');
    }
    useEffect(() => {
        socket.on('clientReceiveAnswer', (data) => {
            const { _id, name, role, chat } = data;
            setChatHistory((prevValue) => {
                return [...prevValue, { _id, name, role, chat }]
            });
        });
        socket.on('agentPickedQuestion', (data) => {
            const { message, queriesPickedMessageToAgent, queriesPickedAgentToMessage } = data;
            setQueriesPickedByAgent(queriesPickedMessageToAgent);
        });
        return () => {
            socket.removeListener('clientReceiveAnswer');
            socket.removeListener('agentPickedQuestion');
        }
    }, []);
    useEffect(() => {
        socket.on('queryInMediumPriorityRoom', (data) => {
            const { _id, name, role, chat, priority, messageId } = data;
            setChatHistory((prevValue) => {
                return [...prevValue, { _id, name, role, chat, priority, messageId }];
            });
        });
        socket.on('queryInLowPriorityRoom', (data) => {
            const { _id, name, role, chat, priority, messageId } = data;
            setChatHistory((prevValue) => {
                return [...prevValue, { _id, name, role, chat, priority, messageId }];
            });
        });
        socket.on('queryInHighPriorityRoom', (data) => {
            const { _id, name, role, chat, priority, messageId } = data;
            setChatHistory((prevValue) => {
                return [...prevValue, { _id, name, role, chat, priority, messageId }];
            });
        });
        return () => {
            socket.removeListener('queryInMediumPriorityRoom');
            socket.removeListener('queryInLowPriorityRoom');
            socket.removeListener('queryInHighPriorityRoom');
        };
    }, []);
    useEffect(() => {
        if (localStorage.getItem('name') === null) {
            navigate('/');
        }
        else {
            if (localStorage.getItem('role') === 'Client' || localStorage.getItem('role') === 'Agent') {
                if (!socket.connected) {
                    socket.connect();
                    const url = new URL(window.location.href);
                    const params = new URLSearchParams(url.search);
                    const data = {
                        roomType: params.get('roomType')
                    }
                    socket.emit('agentJoinRoom', data)
                }
            }
        }
        return () => {
            const url = new URL(window.location.href);
            const params = new URLSearchParams(url.search);
            const data = {
                roomType: params.get('roomType')
            }
            socket.emit('agentLeaveRoom', data);
        }
    }, [navigate]);
    const filterByClientId = (data) => {
        if (searchByClientId) {
            const regex = new RegExp(searchByClientId, 'i');
            if (regex.test(data._id)) {
                return data;
            }
        }
        else {
            return data;
        }
    }
    const filterByClientName = (data) => {
        if (searchByClientName) {
            const regex = new RegExp(searchByClientName, 'i');
            if (regex.test(data.name)) {
                return data;
            }
        }
        else {
            return data;
        }
    }
    const filterByClientMessage = (data) => {
        if (searchByClientMessage) {
            const regex = new RegExp(searchByClientMessage, 'i');
            if (regex.test(data.chat)) {
                return data;
            }
        }
        else {
            return data;
        }
    }
    return (
        <div style={{ height: '100%' }} className="bg-slate-600">
            <h1 style={{ lineHeight: '5vh' }} className="text-center text-white">{localStorage.getItem('role')}</h1>
            <div className="flex flex-row items-center justify-between">
                {
                    localStorage.getItem('role') === 'Agent' ? (<button onClick={backToRoom} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Back
                    </button>) : (<span></span>)
                }
                <div className="flex flex-row items-center space-x-2">
                    {
                        localStorage.getItem('role') === 'Agent' ? (<input onChange={handleChange} value={searchByClientId} style={{ fontSize: '2vh' }} className="p-2 rounded" type="text" name="searchByClientId" id="" placeholder="Search By Id" />) : (<span></span>)
                    }
                    {
                        localStorage.getItem('role') === 'Agent' ? (<input onChange={handleChange} value={searchByClientName} style={{ fontSize: '2vh' }} className="p-2 rounded" type="text" name="searchByClientName" id="" placeholder="Search By Name" />) : (<span></span>)
                    }
                    <input onChange={handleChange} value={searchByClientMessage} style={{ fontSize: '2vh' }} className="p-2 rounded" type="text" name="searchByClientMessage" id="" placeholder="Search By Message" />
                </div>
            </div>
            {
                localStorage.getItem('role') === 'Client' ? (<Question />) : (<span></span>)
            }
            {
                localStorage.getItem('role') === 'Agent' ? (<Pending />) : (<span></span>)
            }
            <div className="flex flex-col">
                <div style={{ height: `${localStorage.getItem('role') === 'Agent' ? '80vh' : '80vh'}`, width: '100vw' }} className="overflow-auto">
                    {
                        chatHistory
                            .filter(filterByClientId)
                            .filter(filterByClientName)
                            .filter(filterByClientMessage)
                            .map((message, id) => {
                                return (
                                    <div key={id}>
                                        {
                                            localStorage.getItem('_id') === message._id ?
                                                (<div style={{ marginTop: '1em', marginBottom: '1em' }} className="bg-slate-500 flex flex-row justify-end p-2 shadow rounded">
                                                    {
                                                        message?.priority === '0' ?
                                                            (
                                                                <p className="text-red-500">{message.chat}</p>
                                                            ) :
                                                            (
                                                                message?.priority === '1' ?
                                                                    (
                                                                        <p className="text-yellow-500">{message.chat}</p>
                                                                    ) :
                                                                    (
                                                                        <p className="text-white">{message.chat}</p>
                                                                    )
                                                            )
                                                    }
                                                    {
                                                        message?.role === 'Client' & localStorage.getItem('role') === 'Agent' ?
                                                            (
                                                                <button style={{ backgroundColor: 'rgba(46, 204, 113)' }} className="rounded-full text-white mx-1 px-1" onClick={() => { pick(message.messageId); setReplyClientId(message._id); setMessageId(message.messageId); setReplyMessagePriority(message.priority); }}>{queriesPickedByAgent[message.messageId] === localStorage.getItem('_id') ? 'Picked' : queriesPickedByAgent[message.messageId] != null ? 'Picked By Another Agent' : 'Pick'}</button>
                                                            )
                                                            : (
                                                                <span></span>
                                                            )
                                                    }
                                                </div>
                                                ) : (
                                                    <div style={{ marginTop: '1em', marginBottom: '1em' }} className="bg-slate-500 flex flex-col justify-start p-2 rounded">
                                                        {
                                                            message?.role === 'Client' & localStorage.getItem('role') === 'Agent' ?
                                                                (
                                                                    <div className="rounded-full text-white mx-1 px-1">
                                                                        <p> _id {message._id}</p>
                                                                        <p> Name {message.name}</p>
                                                                    </div>
                                                                )
                                                                : (
                                                                    <span></span>
                                                                )
                                                        }
                                                        <div className="bg-slate-400 flex flex-row justify-start p-2 rounded">
                                                            {
                                                                message?.priority === '0' ?
                                                                    (
                                                                        <p className="text-red-500">{message.chat}</p>
                                                                    ) :
                                                                    (
                                                                        message?.priority === '1' ?
                                                                            (
                                                                                <p className="text-yellow-500">{message.chat}</p>
                                                                            ) :
                                                                            (
                                                                                <p className="text-white">{message.chat}</p>
                                                                            )
                                                                    )
                                                            }
                                                            {
                                                                message?.role === 'Client' & localStorage.getItem('role') === 'Agent' ?
                                                                    (
                                                                        <button style={{ backgroundColor: 'rgba(46, 204, 113)' }} className="rounded-full text-white mx-1 px-1" onClick={() => { pick(message.messageId); setReplyClientId(message._id); setMessageId(message.messageId); setReplyMessagePriority(message.priority); }}>{queriesPickedByAgent[message.messageId] === localStorage.getItem('_id') ? 'Picked' : queriesPickedByAgent[message.messageId] != null ? 'Picked By Another Agent' : 'Pick'}</button>
                                                                    )
                                                                    : (
                                                                        <span></span>
                                                                    )
                                                            }
                                                        </div>
                                                    </div>
                                                )
                                        }
                                    </div>
                                );
                            })
                    }
                </div>
                <div>
                    <input onChange={handleQuery} style={{ height: '5vh', width: '100%' }} value={chat} className="p-2 rounded" type="text" name="name" id="" placeholder="Type your query" />
                    <button onClick={sendQuery} style={{ height: '5vh', width: '100%', backgroundColor: 'rgba(46, 204, 113)' }} className="rounded-none text-white">Send</button>
                </div>
            </div>
        </div>
    );
};
export default Home;