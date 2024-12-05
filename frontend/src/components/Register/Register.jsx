import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../Api";

const Register = () => {
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    // const [user, setUser] = useState();
    const navigate = useNavigate();
    const handleChange = (e) => {
        if (e.target.name === 'name') {
            setName(e.target.value);
        }
        else {
            setRole(e.target.value);
        }
    };
    const handleSubmit = async () => {
        try {
            const response = await registerUser({ name, role });
            // setUser(response?.data?.user);
            localStorage.setItem('_id', response?.data?.user?._id)
            localStorage.setItem('name', response?.data?.user?.name)
            localStorage.setItem('role', response?.data?.user?.role)
            if (localStorage.getItem('role') === 'Client') {
                navigate('/home');
            }
            else {
                navigate('/room');
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        if (localStorage.getItem('name') != null) {
            if (localStorage.getItem('role') === 'Client') {   
                navigate('/home');
            }
            else {
                navigate('/room');
            }
        }
    }, [navigate]);
    return (
        <div className="bg-yellow-600 h-screen w-screen">
            <h1 style={{ fontSize: '4vw' }} className="text-center">Messaging System For Branch</h1>
            <div style={{ marginTop: '30vh' }} className="flex flex-col w-1/4 space-y-5 mx-auto">
                <input style={{ fontSize: '2vw' }} onChange={handleChange} value={name} className="p-2 rounded" type="text" name="name" id="" placeholder="Enter your Name" />
                <input style={{ fontSize: '2vw' }} onChange={handleChange} value={role} className="p-2 rounded" type="text" name="role" id="" placeholder="Enter your role" />
                <button style={{ fontSize: '2vw' }} onClick={handleSubmit} className="bg-gray-500 rounded p-2">Enter</button>
            </div>
        </div>
    )
};

export default Register;