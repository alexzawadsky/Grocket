import React, { useState } from 'react'
import { useRef } from 'react'
import { NavLink } from 'react-router-dom'
import api from '../api/api'

const Register = () => {

    const nameRef = useRef()
    const lastNameRef = useRef()
    const emailRef = useRef()
    const pwdRef = useRef()

    const [loading, setLoading] = useState(false)

    return (
        <div className='w-full h-full flex items-center justify-center'>
            <div className='w-1/3'>
                <h1 className='text-accent-orange text-7xl font-bolditalic pb-5'>Grocket</h1>
                <form className='grid gap-5' onSubmit={(e) => {
                    e.preventDefault()
                    api.register(nameRef.current.value, lastNameRef.current.value, emailRef.current.value, pwdRef.current.value, setLoading)
                }}>
                    <div className="grid md:grid-cols-2 gap-5">
                        <div className='w-full grid gap-1'>
                            <label className='text-xl' htmlFor="email">Name:</label>
                            <br />
                            <input ref={nameRef} className='grocket-input' type="text" id='email' />
                        </div>
                        <div className='w-full grid gap-1'>
                            <label className='text-xl' htmlFor="email">Last name:</label>
                            <br />
                            <input ref={lastNameRef} className='grocket-input' type="text" id='email' />
                        </div>
                    </div>
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
                    <button className='bg-accent-orange py-3 text-white rounded-xl font-bold'>{!loading ? 'Register' : 'Loading...'}</button>
                    <NavLink to='/login'>Already have the account?</NavLink>
                </form>
            </div>
        </div>
    )
}

export default Register