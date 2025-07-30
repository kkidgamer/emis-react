import React, { useState } from "react";
import { Link } from "react-router-dom";



const RegisterUserComponent = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('client');
  return (
    <div className='container mt-5 ' style={{maxWidth:'500px'}}>
        <form action="" className='card shadow bg-light p-4 rounded   '>
            <h1 className="text-center mb-4"></h1>
            <h2 className='text-center mb-4 text-success'>Register</h2>

            {/* inputs */}
            <input type="text" className='form-control mb-3' placeholder='Enter your name' value={name} onChange={(e)=>setName(e.target.value)} required />
            {name}
            <input type="email" className='form-control mb-3' placeholder='Enter your email' value={email} onChange={(e)=>setEmail(e.target.value)} required />
            {email}
            <input type="text" className='form-control mb-3' placeholder='Enter your phone number' value={phone} onChange={(e)=>setPhone(e.target.value)} required />
            {phone}
            <input type="text" className='form-control mb-3' placeholder='Enter your address' value={address} onChange={(e)=>setAddress(e.target.value)} required />
            {address}
            <input type="password" className='form-control mb-3' placeholder='Enter your password' value={password} onChange={(e)=>setPassword(e.target.value)} required />
            {password}
            
            
            <div className="d-grid mb-3">
                <button type="submit" className='btn btn-success'>Register</button>
            </div>
            <div className="text-center">
                <p>Already have an account? {''}
                    <Link to={'/login'} className='text-decoration-none'>Login</Link>
                </p>
            </div>
        </form>

    </div>
  )
}

export default RegisterUserComponent
