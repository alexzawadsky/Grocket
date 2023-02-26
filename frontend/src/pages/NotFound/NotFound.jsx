import React from 'react'
import { NavLink } from 'react-router-dom'

const NotFound = () => {
    return (
        <div className='w-full h-full text-center items-center flex justify-center flex-col gap-10 container mx-auto p-5'>
            <h1 className='font-bolditalic text-3xl'>The page you are looking for is not found, check URL or press the button bellow to go back</h1>
            <NavLink className='bg-accent-orange p-3 text-white font-bold px-5 rounded-lg hover:bg-accent-orange/[0.8]' to='/'>Home page</NavLink>
        </div>
    )
}

export default NotFound