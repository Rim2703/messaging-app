import React, { useEffect, useState } from "react";
import { socket } from "../../socket";
import { useNavigate } from "react-router-dom";
import { totalPendingQuery } from "../../Api";
const Room = () => {
    const navigate = useNavigate();
    const [pendingLowPriorityQuery, setPendingLowPriorityQuery] = useState(0);
    const [pendingMediumPriorityQuery, setPendingMediumPriorityQuery] = useState(0);
    const [pendingHighPriorityQuery, setPendingHighPriorityQuery] = useState(0);
    const enterIntoRoom = (roomType) => {
        const data = { roomType };
        socket.emit('agentJoinRoom', data);
        navigate(`/home?roomType=${roomType}`);
    };
    const totalPendingQueries = async () => {
        const response = await totalPendingQuery();
        setPendingLowPriorityQuery(response?.data?.totalPendingQuery[0])
        setPendingMediumPriorityQuery(response?.data?.totalPendingQuery[1]);
        setPendingHighPriorityQuery(response?.data?.totalPendingQuery[2]);
    }
    useEffect(() => {
        if (localStorage.getItem('name') === null) {
            navigate('/');
        }
        else {
            if (localStorage.getItem('role') === 'Agent') {
                if (!socket.connected) {
                    socket.connect();
                }
            }
        }
        totalPendingQueries();
        socket.on('agentReceiveQuery', (data) => {
            const { totalPendingQuery } = data;
            localStorage.setItem('pendingLowPriorityQuery', totalPendingQuery[0]);
            localStorage.setItem('pendingMediumPriorityQuery', totalPendingQuery[1]);
            localStorage.setItem('pendingHighPriorityQuery', totalPendingQuery[2]);
            setPendingLowPriorityQuery(totalPendingQuery[0]);
            setPendingMediumPriorityQuery(totalPendingQuery[1]);
            setPendingHighPriorityQuery(totalPendingQuery[2]);
            return () => {
                socket.removeListener('agentReceiveQuery');
            }
        });
    }, [navigate]);
    return (
        <div className="bg-slate-600 h-screen w-screen">
            <h1 style={{ fontSize: '5vh' }} className="text-center text-white">Join Room</h1>
            <div style={{ marginTop: '25vh' }} className="grid mb-8 border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 md:mb-12 md:grid-cols-3">
                <figure onClick={() => enterIntoRoom('lowPriorityRoom')} className="flex flex-col items-center justify-center p-8 text-center bg-white border-b border-gray-200 rounded-t-lg md:rounded-t-none md:rounded-tl-lg md:border-r dark:bg-gray-800 dark:border-gray-700">
                    <blockquote className="max-w-2xl mx-auto mb-4 text-gray-500 lg:mb-8 dark:text-gray-400">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Low Priority Queries</h3>
                    </blockquote>
                    <figcaption className="flex items-center justify-center space-x-3">
                        <div className="space-y-0.5 font-medium dark:text-white text-left">
                            <h3 className="text-lg font-semibold text-white">Total Pending Queries</h3>
                            <div className="text-sm text-white text-center">{pendingLowPriorityQuery}</div>
                        </div>
                    </figcaption>
                </figure>
                <figure onClick={() => enterIntoRoom('mediumPriorityRoom')} className="flex flex-col items-center justify-center p-8 text-center bg-white border-b border-gray-200 rounded-tr-lg dark:bg-gray-800 dark:border-gray-700">
                    <blockquote className="max-w-2xl mx-auto mb-4 text-gray-500 lg:mb-8 dark:text-gray-400">
                        <h3 className="text-lg font-semibold text-yellow-500">Medium Priority Queries</h3>
                    </blockquote>
                    <figcaption className="flex items-center justify-center space-x-3">
                        <div className="space-y-0.5 font-medium dark:text-white text-left">
                            <h3 className="text-lg font-semibold text-yellow-500">Total Pending Queries</h3>
                            <div className="text-sm text-yellow-500 text-center">{pendingMediumPriorityQuery}</div>
                        </div>
                    </figcaption>
                </figure>
                <figure onClick={() => enterIntoRoom('highPriorityRoom')} className="flex flex-col items-center justify-center p-8 text-center bg-white border-b border-gray-200 rounded-tr-lg dark:bg-gray-800 dark:border-gray-700">
                    <blockquote className="max-w-2xl mx-auto mb-4 text-gray-500 lg:mb-8 dark:text-gray-400">
                        <h3 className="text-lg font-semibold text-red-500">High Priority Queries</h3>
                    </blockquote>
                    <figcaption className="flex items-center justify-center space-x-3">
                        <div className="space-y-0.5 font-medium dark:text-white text-left">
                            <h3 className="text-lg font-semibold text-red-500">Total Pending Queries</h3>
                            <div className="text-sm text-red-500 text-center">{pendingHighPriorityQuery}</div>
                        </div>
                    </figcaption>
                </figure>
            </div>

        </div>
    );
};
export default Room;