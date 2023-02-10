import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import AuthContext from '../contexts/AuthProvider'
import Title from './Title'

const PrivateRoute = ({ element }) => {

    const { user } = useContext(AuthContext)

    return (
        <>
            {user ?
                element
                :
                <div className='grid gap-5'>
                    <Title text='This page exists, but you need to log in to your account to see it' />
                    <NavLink className='bg-accent-orange font-bold py-3 w-fit px-5 rounded-xl text-white' to='/login'>Login</NavLink>
                </div>}
        </>
    )
}

export default PrivateRoute