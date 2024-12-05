import { io } from 'socket.io-client';

const URL = 'http://localhost:8080';

export const socket = io(URL, {
    autoConnect: false,
    query: {
        _id: localStorage.getItem('_id'),
        name: localStorage.getItem('name'),
        role: localStorage.getItem('role'),
    }
});
