import React, { useState } from 'react'

const LoginComponent = () => {
    const [email, setEmail]= useState('')
    const [password, setPassword] = useState('')
  return (
    <div>
        <form action="">
            <h1>EMIS</h1>
            <h2>Login</h2>
            
            {/* inputs */}
            <input type="email" placeholder='Enter email' value={email} onChange={(e)=>setEmail(e.target.value)} />
            {email}
            <input type="password" placeholder='Enter password' value={password} onChange={(e)=>setPassword(e.target.value)} />
            {password}
            <div className="d-grid mb-3">
                <button type="submit" className='btn btn-success'>Login</button>
            </div>
        </form>

    </div>
  )
}

export default LoginComponent