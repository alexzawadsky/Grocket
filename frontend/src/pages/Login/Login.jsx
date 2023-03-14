import React from 'react'
import { useRef, useState, useContext } from 'react'
import { NavLink, useSearchParams } from 'react-router-dom'
import AuthContext from '../../contexts/AuthProvider'

const Login = () => {

    const { loginUser } = useContext(AuthContext)

    const [searchParams, setSearchParams] = useSearchParams()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState()

    const handleSubmit = (e) => {
        setLoading(true)
        e.preventDefault()
        const data = {
            email,
            password,
            redirectFrom: searchParams.get('redirectFrom') || '/'
        }
        loginUser(data, setError)
        setLoading(false)
    }

    return (
        <div className='w-full h-full flex items-center justify-center'>
            <div className='lg:w-1/3'>
                <h1 className='text-accent-orange text-7xl font-bolditalic pb-5'>Grocket</h1>
                <form className='grid gap-5' onSubmit={handleSubmit}>
                    <div className='w-full grid gap-1'>
                        <label className='text-xl' htmlFor="email">Email:</label>
                        <br />
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            className='grocket-input'
                            type="text"
                            id='email'
                        />
                    </div>
                    <div className='w-full grid gap-1'>
                        <label className='text-xl' htmlFor="email">Password:</label>
                        <br />
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            className='grocket-input'
                            type="password"
                            id='email'
                        />
                    </div>
                    <button
                        disabled={email === '' || password === ''}
                        className='button-fill-orange !w-full'
                    >
                        {!loading ? 'Log In' : 'Loading...'}
                    </button>
                    {/* {error ? <p className='text-accent-red font-bold'>{error.status} {error.message}</p> : null} */}
                    {error && error.status === 401 ? <NavLink to='/password-reset' className='hover:text-accent-orange'>Reset password</NavLink> : null}
                    <NavLink to='/register'>Don't have an account?</NavLink>
                </form>
            </div>
        </div>
    )
}

export default Login