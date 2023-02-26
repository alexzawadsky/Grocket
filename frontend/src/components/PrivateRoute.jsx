import React, { useContext } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import AuthContext from '../contexts/AuthProvider'
import { Title } from './'

const PrivateRoute = ({ children }) => {

    const { user } = useContext(AuthContext)

    return (
        <>
            {user ?
                children ? children : <Outlet />
                :
                <div className='flex flex-col gap-5 items-center justify-center h-full'>
                    <Title text='This page exists, but you need to log in to your account to see it' />
                    <NavLink className='bg-accent-orange font-bold py-3 w-fit px-5 rounded-xl text-white' to='/login'>Login</NavLink>
                </div>}
        </>
    )
}

export default PrivateRoute