import React, { useContext, useEffect, useState } from 'react'
import { NavLink, Outlet, useOutlet } from 'react-router-dom'
import { FiLogOut } from 'react-icons/fi'
import { ProfileCard } from '../../components'
import AuthContext from '../../contexts/AuthProvider'
import { useMediaQuery } from 'react-responsive'
import useAxios from '../../hooks/useAxios'
import { AiFillHeart, AiOutlineSetting } from 'react-icons/ai'
import { BsCartCheck, BsCartDash, BsCart } from 'react-icons/bs'
// import Flag from 'react-flags'

const MyProfile = () => {

    const [user, setUser] = useState(null)

    const isTablet = useMediaQuery({ query: '(min-width: 768px)' })
    const { logoutUser } = useContext(AuthContext)
    const outlet = useOutlet()

    const api = useAxios()

    useEffect(_ => {
        api.get('/api/v1/users/me').then(res => setUser(res.data)).catch(err => alert(err))
    }, [])

    return (
        <>
            {user ? <div className='flex flex-col items-center md:items-start md:flex-row gap-5'>
                {outlet && !isTablet ?
                    null
                    :
                    (
                        <div className='shrink-0 grid gap-5'>
                            <ProfileCard
                                id={user.id}
                                firstName={user.first_name}
                                lastName={user.last_name}
                                email={user.email}
                                avatar={user.avatar}
                                rating={5.00}
                                phone={user.phone}
                                withComments={true}
                            />
                            <NavLink className='font-bold text-xl flex items-center gap-2' to='lots'><BsCart />Active items</NavLink>
                            <NavLink className='font-bold text-xl flex items-center gap-2' to='archive'><BsCartDash />Archived items</NavLink>
                            <NavLink className='font-bold text-xl flex items-center gap-2' to='sold'><BsCartCheck />Sold items</NavLink>
                            <NavLink className='font-bold text-xl flex items-center gap-2' to='favourites'><AiFillHeart color={'red'} />Favourites</NavLink>
                            <NavLink className='font-bold text-xl flex items-center gap-2' to='settings'><AiOutlineSetting />Settings</NavLink>
                            <button onClick={logoutUser} className='text-accent-red font-bold flex items-center gap-2 hover:gap-3 transition-all duration-150'>Logout from account<FiLogOut /></button>
                        </div>
                    )
                }
                <Outlet />
            </div> : null}
        </>
    )
}

export default MyProfile