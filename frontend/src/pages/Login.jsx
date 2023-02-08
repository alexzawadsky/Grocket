import React from 'react'
import api from '../api/api'
import { useRef, useState } from 'react'
import { NavLink, redirect } from 'react-router-dom'

const Login = () => {

    const emailRef = useRef()
    const pwdRef = useRef()

    const [loading, setLoading] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        const data = {
            email: emailRef.current.value,
            pwd: pwdRef.current.value
        }
        api.login(data).then(res => redirect('/')).catch(err => {
            setLoading(false)
            alert(err)
        })
    }

    return (
        <div className='w-full h-full flex items-center justify-center'>
            <div className='w-1/3'>
                <h1 className='text-accent-orange text-7xl font-bolditalic pb-5'>Grocket</h1>
                <form className='grid gap-5' onSubmit={handleSubmit}>
                    <div className='w-full grid gap-1'>
                        <label className='text-xl' htmlFor="email">Email:</label>
                        <br />
                        <input ref={emailRef} className='grocket-input' type="text" id='email' />
                    </div>
                    <div className='w-full grid gap-1'>
                        <label className='text-xl' htmlFor="email">Password:</label>
                        <br />
                        <input ref={pwdRef} className='grocket-input' type="password" id='email' />
                    </div>
                    <button className='bg-accent-orange py-3 text-white rounded-xl'>{!loading ? 'Log In' : 'Loading...'}</button>
                    <NavLink to='/register'>Don't have an account?</NavLink>
                </form>
            </div>
        </div>
    )
}

export default Login