import React, { useState, useContext } from 'react'
import noteContext from '../Context/Notes/noteContext'
import Alerts from './Alerts';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate=useNavigate()
    const context = useContext(noteContext)
    const {alert,setAlert,setType,type} = context;
    const [creadentials, setCreadentials] = useState({ email: "", password: "" })

    const changeAlert = (newAlert,type) => {
        setAlert(newAlert)
        setType(type)
        setTimeout(() => {
            setAlert(null)
        }, 1500);
    }
    const handleSubmit = async (e) => {
        e.preventDefault()

        const response = await fetch(`http://localhost:5000/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: creadentials.email, password: creadentials.password })
        });
        const json = await response.json()
        console.log(json)

        if (json.success) {
            localStorage.setItem("token", json.authToken)
            navigate("/")
            changeAlert("Welcome!","success")
        }
        else {
            changeAlert(json.error);
            console.log(json.error,"danger")
        }
    }

    const onChange = (e) => {
        setCreadentials({ ...creadentials, [e.target.name]: e.target.value })
    }


    return (
        <>
            <Alerts alert={alert} />
            <div className='container my-3'>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input type="email" className="form-control" value={creadentials.email} onChange={onChange} name='email' id="email" aria-describedby="emailHelp" />
                        <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" className="form-control" onChange={onChange} value={creadentials.password} name='password' id="password" />
                    </div>
                    {/* <div className="mb-3 form-check">
                    <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
                        <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
                </div> */}
                    <button type="submit" className="btn btn-primary">Log In</button>
                </form>
            </div>
        </>
    )
}
