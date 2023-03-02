import React, { useContext } from 'react'
import { NavLink, Outlet, useOutlet } from 'react-router-dom'
import { FiLogOut } from 'react-icons/fi'
import { ProfileCard, Spinner } from '../../components'
import AuthContext from '../../contexts/AuthProvider'
import { useMediaQuery } from 'react-responsive'
import { AiFillHeart, AiOutlineSetting } from 'react-icons/ai'
import { BsCartCheck, BsCartDash, BsCart } from 'react-icons/bs'
import { useProfile } from '../../api/api'
// import Flag from 'react-flags'

const MyProfile = () => {

    const isTablet = useMediaQuery({ query: '(min-width: 768px)' })
    const { logoutUser } = useContext(AuthContext)
    const outlet = useOutlet()

    const { data, isLoading, error } = useProfile()

    if (isLoading) return <Spinner />
    if (error) return error.message

    return (
        <div className='grid md:grid-cols-[1fr_2fr] lg:grid-cols-[1fr_3fr] items-center md:items-start md:flex-row gap-5'>
            {outlet && !isTablet ?
                null
                :
                (
                    <div className='shrink-0 grid gap-5'>
                        <ProfileCard
                            id={data.id}
                            firstName={data.first_name}
                            lastName={data.last_name}
                            email={data.email}
                            avatar={data.avatar}
                            rating={5.00}
                            phone={data.phone}
                            withComments={true}
                        />
                        <NavLink className='font-bold text-xl flex items-center gap-2 w-fit' to='lots'><BsCart />Active items</NavLink>
                        <NavLink className='font-bold text-xl flex items-center gap-2 w-fit' to='archive'><BsCartDash />Archived items</NavLink>
                        <NavLink className='font-bold text-xl flex items-center gap-2 w-fit' to='sold'><BsCartCheck />Sold items</NavLink>
                        <NavLink className='font-bold text-xl flex items-center gap-2 w-fit' to='favourites'><AiFillHeart color={'red'} />Favourites</NavLink>
                        <NavLink className='font-bold text-xl flex items-center gap-2 w-fit' to='settings'><AiOutlineSetting />Settings</NavLink>
                        <button onClick={logoutUser} className='text-accent-red font-bold flex items-center gap-2 hover:gap-3 transition-all duration-150 w-fit'>Logout from account<FiLogOut /></button>
                    </div>
                )
            }
            <Outlet />
        </div>
    )
}

export default MyProfile