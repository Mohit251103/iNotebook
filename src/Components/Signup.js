import React, { useContext, useState } from 'react'
import noteContext from '../Context/Notes/noteContext';
import Alerts from './Alerts';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const history=useNavigate()
  const context = useContext(noteContext)
  const { alert, setAlert,setType,type } = context;
  const [credentials, setCredentials] = useState({ name: "", email: "", password: "" })

  const changeAlert = (newAlert,type) => {
    setAlert(newAlert)
    setType(type)
    setTimeout(() => {
      setAlert(null)
    }, 1500);
  }
  const handleSubmit = async (e) => {
    e.preventDefault()

    const response = await fetch(`http://localhost:5000/api/auth/createuser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name: credentials.name, email: credentials.email, password: credentials.password })
    });
    const json = await response.json()
    console.log(json)

    if (json.success) {
      localStorage.setItem("token", json.authToken)
      history("/")
      changeAlert("Welcome!","success")
    }
    else {
      changeAlert(json.error,"danger");
      console.log(json.error)
    }
  }

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  return (
    <>
      <Alerts alert={alert} type={type} />
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input type="text" className="form-control" value={credentials.name} name='name' id="name" onChange={onChange} required/>
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" className="form-control" value={credentials.email} name='email' id="email" aria-describedby="emailHelp" onChange={onChange} required />
            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" value={credentials.password} name='password' id="password" onChange={onChange} required/>
          </div>
          <button type="submit" className="btn btn-primary">Sign Up</button>
        </form>
      </div>
    </>
  )
}
