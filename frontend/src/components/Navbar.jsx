import React from 'react'
import { NavLink } from 'react-router-dom'
import { BsPersonFill } from 'react-icons/bs'

const Navbar = () => {
    return (
        <nav className='w-full fixed left-0 top-0 bg-white shadow-lg'>
            <div className='flex container px-5 mx-auto gap-10 h-16 items-center'>
                <NavLink className='flex-grow text-3xl font-bolditalic text-accent-orange hover:text-accent-orange/[0.8]' to='/'>Grocket</NavLink>
                <NavLink className='flex items-center gap-2 h-10' to='/profile'><BsPersonFill />Profile</NavLink>
                <NavLink className='px-6 h-12 bg-accent-orange rounded-xl hover:bg-accent-orange/[0.8] flex items-center text-white text-sm md:text-lg' to='/sell'>Sell item</NavLink>
            </div>
        </nav>
    )
}

export default Navbar