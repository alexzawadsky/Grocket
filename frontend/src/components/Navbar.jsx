import React from 'react'
import { NavLink } from 'react-router-dom'
import { BsPersonFill } from 'react-icons/bs'
import { MdOutlineSell } from 'react-icons/md'
import AuthContext from '../contexts/AuthProvider'
import { useContext } from 'react'

const Navbar = () => {

    const { user } = useContext(AuthContext)

    return (
        <nav className='w-full fixed z-50 left-0 top-0 bg-white shadow-lg'>
            <div className='flex container px-5 mx-auto gap-10 h-16 items-center'>
                <NavLink className='flex-grow text-3xl font-bolditalic text-accent-orange hover:text-accent-orange/[0.8]' to='/'>Grocket</NavLink>
                {
                    user ?
                        <NavLink className='flex items-center gap-2 h-10' to='/profile'><BsPersonFill />Profile</NavLink>
                        :
                        <NavLink to='/login'>Login</NavLink>
                }
                <NavLink className='px-6 h-12 gap-2 bg-accent-orange rounded-xl hover:bg-accent-orange/[0.8] flex items-center text-white text-sm md:text-lg' to='/sell'>Sell item<MdOutlineSell /></NavLink>
            </div>
        </nav>
    )
}

export default Navbar