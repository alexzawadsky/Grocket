import React from 'react'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
    return (
        <nav className='w-full fixed left-0 top-0 bg-white shadow-lg'>
            <div className='flex container px-5 mx-auto gap-10 h-16 items-center'>
                <NavLink className='flex-grow text-3xl font-bolditalic text-accent-orange' to='/'>Grocket</NavLink>
                <NavLink to='/profile'>Profile</NavLink>
                <NavLink className='px-6 h-12 bg-accent-orange rounded-xl hover:bg-accent-orange/[0.9] flex items-center text-white' to='/sell'>Sell item</NavLink>
            </div>

        </nav>
    )
}

export default Navbar