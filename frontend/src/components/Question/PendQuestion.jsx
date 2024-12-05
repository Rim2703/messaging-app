import React, { useState } from 'react'
import { replyToPendingQuestion } from '../../Api';

const PendQuestion = ({ data }) => {
    const [displaySendButtion, setDisplaySendButton] = useState('none');
    const [message, setMessage] = useState('');
    const handleDisplay = () => {
        if (displaySendButtion === 'none') {
            setDisplaySendButton('block');
        }
        else {
            setDisplaySendButton('none')
        }
    };
    const handleSend = async (_id) => {
        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);
        const data = { _id, message, roomType: params.get('roomType') };
        await replyToPendingQuestion(data);
        setDisplaySendButton('none');
    };
    const handleChange = (e) => {
        setMessage(e.target.value);
    }
    return (
        <>
            <div style={{ marginTop: '1em', marginBottom: '1em' }} className="bg-slate-500 justify-end p-2 shadow rounded">
                <p className="text-white text-right">Question : {data.query} ?</p>
                <button onClick={handleDisplay} style={{ backgroundColor: 'rgba(46, 204, 113)' }} className="rounded-full text-white mx-1 px-1">Reply</button>
                <div style={{ display: displaySendButtion, marginTop: '1em', marginBottom: '1em' }}>
                    <input onChange={handleChange} value={message} style={{ height: '5vh', width: '100%' }} className="p-2 rounded" type="text" name="message" id="" placeholder="Type your Ans" />
                    <button onClick={() => handleSend(data?._id)} style={{ height: '5vh', width: '100%', backgroundColor: 'rgba(46, 204, 113)' }} className="rounded-none text-white">Send</button>
                </div>
            </div>
        </>
    )
}

export default PendQuestion;
